import React, { useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Button, Input, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import _ from 'lodash';
import numeral from 'numeral';
import BootstrapTable from 'react-bootstrap-table-next';
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'react-feather';
import Loader from 'react-loader-spinner';

const Pools = props => {
  const poolsData = useSelector(content => content.data.pools_data);

  const perPageSizes = [5, 10, 25, 100];

  const [poolsSort, setPoolsSort] = useState({ field: 'total_liquidity_quote', direction: 'desc' });
  const [poolsFilter, setPoolsFilter] = useState('');
  const [poolsPerPage, setPoolsPerPage] = useState(10);
  const [poolsPerPageDropdownOpen, setPoolsPerPageDropdownOpen] = useState(false);
  const togglePoolsPerPageDropdown = () => setPoolsPerPageDropdownOpen(!poolsPerPageDropdownOpen);
  const [poolsPage, setPoolsPage] = useState(0);

  const useWindowSize = () => {
    const [size, setSize] = useState(null);
    useLayoutEffect(() => {
      const updateSize = () => setSize(window.screen.width);
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  };
  const width = useWindowSize();

  const filterredPoolsData = poolsData && poolsData.filter(poolData => poolData.token_0 && poolData.token_1).map((poolData, i) => {
    return {
      ...poolData,
      rank: i,
      name: `${poolData.token_0.contract_ticker_symbol} - ${poolData.token_1.contract_ticker_symbol}`,
      token_0_reserve: poolData.token_0.reserve / Math.pow(10, poolData.token_0.contract_decimals),
      token_1_reserve: poolData.token_1.reserve / Math.pow(10, poolData.token_1.contract_decimals),
      total_liquidity_quote: typeof poolData.total_liquidity_quote === 'number' ? poolData.total_liquidity_quote : -1,
      volume_24h_quote: typeof poolData.volume_24h_quote === 'number' ? poolData.volume_24h_quote : -1,
      volume_7d_quote: typeof poolData.volume_7d_quote === 'number' ? poolData.volume_7d_quote : -1,
      fee_24h_quote: typeof poolData.fee_24h_quote === 'number' ? poolData.fee_24h_quote : -1,
      annualized_fee: typeof poolData.annualized_fee === 'number' ? poolData.annualized_fee : -1,
    };
  }).filter(poolData => !poolsFilter ||
    poolsFilter.toLowerCase() === poolData.exchange ||
    poolData.name.toLowerCase().startsWith(poolsFilter.toLowerCase()) ||
    (poolData.token_0 && ((poolData.token_0.contract_name && poolData.token_0.contract_name.toLowerCase().indexOf(poolsFilter.toLowerCase()) > -1) || (poolData.token_0.contract_ticker_symbol && poolData.token_0.contract_ticker_symbol.toLowerCase().indexOf(poolsFilter.toLowerCase()) > -1))) ||
    (poolData.token_1 && ((poolData.token_1.contract_name && poolData.token_1.contract_name.toLowerCase().indexOf(poolsFilter.toLowerCase()) > -1) || (poolData.token_1.contract_ticker_symbol && poolData.token_1.contract_ticker_symbol.toLowerCase().indexOf(poolsFilter.toLowerCase()) > -1)))
  );
  const filterredPagePoolsData = filterredPoolsData && filterredPoolsData.filter((poolData, i) => i >= poolsPage * poolsPerPage && i < (poolsPage + 1) * poolsPerPage);

  return (
    <div className="my-2 my-md-3 my-lg-4 mx-auto px-0 px-md-3 px-lg-5" style={{ maxWidth: '80rem' }}>
      <Row className="mt-3 mx-1">
        <Col lg="12" md="12" xs="12">
          <Row className="mb-2">
            <Col lg="6" md="6" xs="12" className="d-flex align-items-center">
              <h3 className="mb-0" style={{ fontWeight: 600 }}>{"All Pools"}</h3>
            </Col>
            {poolsData && (
              <Col lg="6" md="6" xs="12" className="d-flex align-items-center justify-content-start justify-content-md-end mt-2 mt-md-0">
                <Input
                  placeholder="Filter by Symbol / Address"
                  onChange={e => { setPoolsFilter(e.target.value); setPoolsPage(0); }}
                  style={{ maxWidth: '20rem' }}
                />
              </Col>
            )}
          </Row>
          <BootstrapTable
            keyField="rank"
            bordered={false}
            noDataIndication={poolsData ? 'No Data' : <span className="d-flex align-items-center justify-content-center">{"Loading"}<Loader type="ThreeDots" color="white" width="14" height="14" className="mt-1 ml-1" /></span>}
            classes={`${width <= 1024 ? 'table-responsive ' : ''}pb-0`}
            data={!poolsData ? [] : _.orderBy(filterredPagePoolsData, [poolsSort.field || 'rank'], [poolsSort.direction])}
            columns={[
              {
                dataField: 'name',
                text: 'Name',
                headerFormatter: column => (
                  <span className={`${poolsSort.field === column.dataField ? 'text-white' : ''}`} style={{ fontWeight: poolsSort.field === column.dataField ? 700 : 500 }}>
                    {column.text}
                    {poolsSort.field === column.dataField && (
                      <span className="ml-1">
                        {poolsSort.direction === 'desc' ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    )}
                  </span>
                ),
                headerEvents: {
                  onClick: (e, column) => setPoolsSort({ field: column.dataField, direction: poolsSort.field === column.dataField && poolsSort.direction === 'desc' ? 'asc' : 'desc' })
                },
                headerStyle: {
                  cursor: 'pointer',
                  minWidth: '12.5rem'
                },
                formatter: (cell, row) => (
                  <Link to={`/pools/${row.exchange}`} className="d-flex align-items-center">
                    <img src={row.token_0.logo_url} alt="" className="avatar pool-token-0" />
                    <img src={row.token_1.logo_url} alt="" className="avatar pool-token-1" />
                    <span>{cell}</span>
                  </Link>
                ),
              }, {
                dataField: 'total_liquidity_quote',
                text: 'Liquidity',
                headerAlign: 'right',
                headerFormatter: column => (
                  <span className={`${poolsSort.field === column.dataField ? 'text-white' : ''}`} style={{ fontWeight: poolsSort.field === column.dataField ? 700 : 500 }}>
                    {column.text}
                    {poolsSort.field === column.dataField && (
                      <span className="ml-1">
                        {poolsSort.direction === 'desc' ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    )}
                  </span>
                ),
                headerEvents: {
                  onClick: (e, column) => setPoolsSort({ field: column.dataField, direction: poolsSort.field === column.dataField && poolsSort.direction === 'desc' ? 'asc' : 'desc' })
                },
                headerStyle: {
                  cursor: 'pointer'
                },
                align: 'right',
                formatter: cell => cell >= 0 ? `$${numeral(cell).format('0,0') !== 'NaN' ? numeral(cell).format('0,0') : 0}` : '-',
              }, {
                dataField: 'volume_24h_quote',
                text: 'Volume 24H',
                headerAlign: 'right',
                headerFormatter: column => (
                  <span className={`${poolsSort.field === column.dataField ? 'text-white' : ''}`} style={{ fontWeight: poolsSort.field === column.dataField ? 700 : 500 }}>
                    {column.text}
                    {poolsSort.field === column.dataField && (
                      <span className="ml-1">
                        {poolsSort.direction === 'desc' ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    )}
                  </span>
                ),
                headerEvents: {
                  onClick: (e, column) => setPoolsSort({ field: column.dataField, direction: poolsSort.field === column.dataField && poolsSort.direction === 'desc' ? 'asc' : 'desc' })
                },
                headerStyle: {
                  cursor: 'pointer'
                },
                align: 'right',
                formatter: cell => cell >= 0 ? `$${numeral(cell).format('0,0') !== 'NaN' ? numeral(cell).format('0,0') : 0}` : '-',
              }, {
                dataField: 'volume_7d_quote',
                text: 'Volume 7D',
                headerAlign: 'right',
                headerFormatter: column => (
                  <span className={`${poolsSort.field === column.dataField ? 'text-white' : ''}`} style={{ fontWeight: poolsSort.field === column.dataField ? 700 : 500 }}>
                    {column.text}
                    {poolsSort.field === column.dataField && (
                      <span className="ml-1">
                        {poolsSort.direction === 'desc' ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    )}
                  </span>
                ),
                headerEvents: {
                  onClick: (e, column) => setPoolsSort({ field: column.dataField, direction: poolsSort.field === column.dataField && poolsSort.direction === 'desc' ? 'asc' : 'desc' })
                },
                headerStyle: {
                  cursor: 'pointer'
                },
                align: 'right',
                formatter: cell => cell >= 0 ? `$${numeral(cell).format('0,0') !== 'NaN' ? numeral(cell).format('0,0') : 0}` : '-',
              }, {
                dataField: 'token_0_reserve',
                text: 'Base Reserve',
                headerFormatter: column => (
                  <span className={`${poolsSort.field === column.dataField ? 'text-white' : ''}`} style={{ fontWeight: poolsSort.field === column.dataField ? 700 : 500 }}>
                    {column.text}
                    {poolsSort.field === column.dataField && (
                      <span className="ml-1">
                        {poolsSort.direction === 'desc' ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    )}
                  </span>
                ),
                headerEvents: {
                  onClick: (e, column) => setPoolsSort({ field: column.dataField, direction: poolsSort.field === column.dataField && poolsSort.direction === 'desc' ? 'asc' : 'desc' })
                },
                headerStyle: {
                  cursor: 'pointer',
                  minWidth: '10rem'
                },
                formatter: (cell, row) => (
                  <div className="d-flex align-items-center">
                    <img src={row.token_0.logo_url} alt="" className="avatar pool-token" />
                    <span>{numeral(cell).format('0,0')}&nbsp;<Link to={`/tokens/${row.token_0.contract_address}`}>{row.token_0.contract_ticker_symbol}</Link></span>
                  </div>
                ),
              }, {
                dataField: 'token_1_reserve',
                text: 'Quote Reserve',
                headerFormatter: column => (
                  <span className={`${poolsSort.field === column.dataField ? 'text-white' : ''}`} style={{ fontWeight: poolsSort.field === column.dataField ? 700 : 500 }}>
                    {column.text}
                    {poolsSort.field === column.dataField && (
                      <span className="ml-1">
                        {poolsSort.direction === 'desc' ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    )}
                  </span>
                ),
                headerEvents: {
                  onClick: (e, column) => setPoolsSort({ field: column.dataField, direction: poolsSort.field === column.dataField && poolsSort.direction === 'desc' ? 'asc' : 'desc' })
                },
                headerStyle: {
                  cursor: 'pointer',
                  minWidth: '10rem'
                },
                formatter: (cell, row) => (
                  <div className="d-flex align-items-center">
                    <img src={row.token_1.logo_url} alt="" className="avatar pool-token" />
                    <span>{numeral(cell).format('0,0')}&nbsp;<Link to={`/tokens/${row.token_1.contract_address}`}>{row.token_1.contract_ticker_symbol}</Link></span>
                  </div>
                ),
              }, {
                dataField: 'fee_24h_quote',
                text: 'Fees 24H',
                headerAlign: 'right',
                headerFormatter: column => (
                  <span className={`${poolsSort.field === column.dataField ? 'text-white' : ''}`} style={{ fontWeight: poolsSort.field === column.dataField ? 700 : 500 }}>
                    {column.text}
                    {poolsSort.field === column.dataField && (
                      <span className="ml-1">
                        {poolsSort.direction === 'desc' ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    )}
                  </span>
                ),
                headerEvents: {
                  onClick: (e, column) => setPoolsSort({ field: column.dataField, direction: poolsSort.field === column.dataField && poolsSort.direction === 'desc' ? 'asc' : 'desc' })
                },
                headerStyle: {
                  cursor: 'pointer'
                },
                align: 'right',
                formatter: cell => cell >= 0 ? `$${numeral(cell).format('0,0') !== 'NaN' ? numeral(cell).format('0,0') : 0}` : '-',
              }, {
                dataField: 'annualized_fee',
                text: '% Fees (Yearly)',
                headerAlign: 'right',
                headerFormatter: column => (
                  <span className={`${poolsSort.field === column.dataField ? 'text-white' : ''}`} style={{ fontWeight: poolsSort.field === column.dataField ? 700 : 500 }}>
                    {column.text}
                    {poolsSort.field === column.dataField && (
                      <span className="ml-1">
                        {poolsSort.direction === 'desc' ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    )}
                  </span>
                ),
                headerEvents: {
                  onClick: (e, column) => setPoolsSort({ field: column.dataField, direction: poolsSort.field === column.dataField && poolsSort.direction === 'desc' ? 'asc' : 'desc' })
                },
                headerStyle: {
                  cursor: 'pointer'
                },
                align: 'right',
                formatter: cell => cell >= 0 ? <span className="text-green">{`${numeral(cell).format('0,0.00%') !== 'NaN' ? numeral(cell).format('0,0.00%') : '0.00%'}`}</span> : '-',
              },
            ]}
          />
          {filterredPoolsData && Math.floor(filterredPoolsData.length / perPageSizes[0]) > 0 && (
            <div className={`text-center d-${width <= 575 ? 'block' : 'flex'} align-items-center justify-content-center justify-content-md-end`}>
              {"Rows per page"}
              <ButtonDropdown direction="up" isOpen={poolsPerPageDropdownOpen} toggle={togglePoolsPerPageDropdown} className="ml-2 mr-0 mr-md-3">
                <DropdownToggle size="sm" color="default" className="dropdown-button">
                  {poolsPerPage}
                </DropdownToggle>
                <DropdownMenu>
                  {perPageSizes.map((perPageSize, key) => (
                    <DropdownItem
                      key={key}
                      disabled={poolsPerPage === perPageSize}
                      onClick={() => { setPoolsPerPage(perPageSize); setPoolsPage(0); }}
                      className={`text-${poolsPerPage === perPageSize ? 'muted' : 'dark'}`}
                      style={{ background: poolsPerPage === perPageSize ? 'rgba(0,0,0,.05)' : undefined, fontWeight: 600 }}
                    >
                      {perPageSize}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>
              {width <= 575 && (<br />)}
              <Button
                color="default"
                size="sm"
                disabled={poolsPage < 1}
                onClick={() => setPoolsPage(poolsPage - 1)}
                className="ml-0 mr-2"
              >
                <ChevronLeft />
              </Button>
              {(poolsPage * poolsPerPage) + 1}
              {" - "}
              {(poolsPage + 1) * poolsPerPage > filterredPoolsData.length ? filterredPoolsData.length : (poolsPage + 1) * poolsPerPage}
              {" of "}
              {numeral(filterredPoolsData.length).format('0,0')}
              <Button
                color="default"
                size="sm"
                disabled={(poolsPage + 1) * poolsPerPage > filterredPoolsData.length}
                onClick={() => setPoolsPage(poolsPage + 1)}
                className="ml-2"
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Pools;