import * as React from 'react';
import classNames from "classnames";
import {convertDate, convertTons} from '../../utils'

import {CurrentElectionData, ElectorData} from "../../electorData";
import {useState} from "react";

type CreditsCardProps = {
    credits: ElectorData['credits']
}

type PaginationButtonProps = {
    page: number,
    currentPage: number,
    onClick: (page: number) => void,
}

const PaginationButton: React.FC<PaginationButtonProps> = ({page, currentPage, onClick}) => {
    const current = page == currentPage;
    return <a
        className={classNames('pagination-link', {'is-current': current})}
        aria-label={current ? `Page ${page}` : `Goto page ${page}`}
        aria-current={current ? 'page' : undefined}
        onClick={() => onClick(page)}
    >{page + 1}</a>
}

const PaginationEllipsis: React.FC = () => <span className="pagination-ellipsis">&hellip;</span>

const CreditsCard: React.FC<CreditsCardProps> = ({credits}) => {
    const [visible, setVisible] = React.useState(false)
    const [filter, setFilter] = React.useState('')
    const [targetPage, setTargetPage] = React.useState(0)

    const filteredCredits = credits
        .map(([key, value]) => [key.replace('0x', '-1:'), value])
        .filter(([key, _value]) => key.search(filter) >= 0)

    const itemsPerPage = 10;
    const totalPages = Math.floor((filteredCredits.length + itemsPerPage - 1) / itemsPerPage)

    let currentPage = targetPage;
    if (targetPage * itemsPerPage > filteredCredits.length && currentPage > 0) {
        currentPage -= 1;
    }

    const setPage = (page: number) => setTargetPage(page)

    return <div className="card tile is-child">
        <header className="card-header is-unselectable" onClick={() => setVisible(!visible)}>
            <p className="card-header-title">
                Credits
            </p>
            <button className="card-header-icon" aria-label="more options">
                <span className="icon">
                    <i className={classNames('fas', {
                        'fa-angle-down': visible,
                        'fa-angle-right': !visible
                    })} aria-hidden="true"/>
                </span>
            </button>
        </header>
        {visible && <div className="card-content">
            <input
                className="input control mb-1"
                value={filter}
                placeholder="Search address..."
                onChange={(e) => setFilter(e.target.value)}
            />
            <table className="table is-fullwidth">
                <thead>
                <tr>
                    <th>Address</th>
                    <th>Stake</th>
                </tr>
                </thead>
                <tbody>{
                    filteredCredits.slice(currentPage * itemsPerPage).slice(0, itemsPerPage).map(([key, value], i) => (
                        <tr key={i} className="is-family-monospace">
                            <td>{key}</td>
                            <td>{convertTons(value)}</td>
                        </tr>
                    ))
                }</tbody>
            </table>
            {totalPages > 1 && <nav className="pagination" role="navigation" aria-label="pagination">
                <a className="pagination-previous" onClick={() => {
                    setPage(Math.max(currentPage - 1, 0))
                }}>Previous</a>
                <a className="pagination-next" onClick={() => {
                    setPage(Math.min(currentPage + 1, totalPages - 1))
                }}>Next page</a>
                <ul className="pagination-list">
                    {currentPage > 1 && <li>
                        <PaginationButton page={0} currentPage={currentPage} onClick={setPage}/>
                    </li>}
                    {currentPage > 2 && <li><PaginationEllipsis/></li>}

                    {currentPage > 0 && <li>
                        <PaginationButton page={currentPage - 1} currentPage={currentPage} onClick={setPage}/>
                    </li>}

                    <li><PaginationButton page={currentPage} currentPage={currentPage} onClick={setPage}/></li>

                    {currentPage + 1 < totalPages && <li>
                        <PaginationButton page={currentPage + 1} currentPage={currentPage} onClick={setPage}/>
                    </li>}

                    {currentPage + 3 < totalPages && <li><PaginationEllipsis/></li>}
                    {currentPage + 2 < totalPages && <li>
                        <PaginationButton page={totalPages - 1} currentPage={currentPage} onClick={setPage}/>
                    </li>}
                </ul>
            </nav>}
        </div>}
    </div>
}

type CurrentElectionProps = {
    electionData?: CurrentElectionData,
}

const CurrentElection: React.FC<CurrentElectionProps> = ({electionData}) => {
    const [visible, setVisible] = useState(false)

    return <div className="card is-disabled tile is-child">
        <header className="card-header is-unselectable" onClick={() => setVisible(!visible)}>
            <p className="card-header-title">
                {electionData == null ? 'No current election' : 'Current election'}
            </p>
            {electionData != null && <button className="card-header-icon" aria-label="more options">
                <span className="icon">
                    <i className={classNames('fas', {
                        'fa-angle-down': visible,
                        'fa-angle-right': !visible
                    })} aria-hidden="true"/>
                </span>
            </button>}
        </header>
        {visible && electionData != null && <div className="card-content">
            <p>Election start: {convertDate(~~electionData.elect_at)}</p>
            <p>Election end: {convertDate(~~electionData.elect_close)}</p>
            <p>Min stake: {convertTons(electionData.min_stake)}</p>
            <p>Min stake: {convertTons(electionData.total_stake)}</p>
        </div>}
    </div>;
}

export type WorkspaceProps = {
    electorData: ElectorData
    currentElectionData: CurrentElectionData | undefined,
}

const Workspace: React.FC<WorkspaceProps> = ({electorData, currentElectionData}) => {
    return <section className="section">
        <div className="tile is-ancestor is-vertical">
            <div className="tile is-parent">
                <CreditsCard credits={electorData.credits}/>
            </div>
            <div className="tile is-parent">
                <CurrentElection electionData={currentElectionData}/>
            </div>
        </div>
    </section>;
}

export default Workspace;
