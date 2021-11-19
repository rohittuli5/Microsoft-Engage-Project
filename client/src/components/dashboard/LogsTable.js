import React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchBar from "material-ui-search-bar";

import { Button, Grid } from '@mui/material';

const axios = require('axios')


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 's_no', numeric: false, disablePadding: true, label: 'S. No.' },
  { id: 'student_name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'student_email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'tab_change_count', numeric: true, disablePadding: false, label: 'Tab Changes' },
  { id: 'ctrl_press_count', numeric: true, disablePadding: false, label: 'CTRL Press' },
  { id: 'full_screen_exit_count', numeric: true, disablePadding: false, label: 'Full Screen Exit' },
  { id: 'mobile_found_count', numeric: true, disablePadding: false, label: 'Mobile Found Count' },
  { id: 'prohibited_object_found_count', numeric: true, disablePadding: false, label: 'Prohibited Object Found' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy===headCell.id ?order:false}
          >
            <TableSortLabel
              active={orderBy===headCell.id}
              direction={orderBy===headCell.id?order:'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Exam Logs
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


export default function LogsTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('company');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows,setRows]=React.useState([]);
  const [interns,setInterns]=React.useState([]);
  const [searched, setSearched] = React.useState("");



  const getData=async (exam_code_val)=>{
    console.log(props.exam_code);
    try {
      const response = await axios.post('/api/logs/allData',{exam_code:exam_code_val});
      console.log(response);
      var curr_logs=[];

      for(var i=0;i<response.data.length;i++){
      
        var obj=new Object();
        obj.s_no=i+1;
        obj.student_name=response.data[i].student_name;
        obj.student_email=response.data[i].student_email;
        obj.tab_change_count=response.data[i].tab_change_count;
        obj.ctrl_press_count=response.data[i].ctrl_press_count;
        obj.full_screen_exit_count=response.data[i].full_screen_exit_count;
        obj.mobile_found_count=response.data[i].mobile_found_count;
        obj.prohibited_object_found_count=response.data[i].prohibited_object_found_count;
        curr_logs=[...curr_logs,obj]
        
      }
      setInterns(curr_logs);
      console.log(curr_logs);
      setRows(curr_logs);
    }
    catch(err){
      console.error(err.message)
    }
  }
  
 
React.useEffect(()=>{
  getData();
  const interval=setInterval(()=>{
    var exam_code_val=props.exam_code;
    getData(exam_code_val)
   },2000)
     
     
   return()=>clearInterval(interval)
},[props.exam_code]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.company);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const requestSearch=(searchVal)=>{
    console.log(searchVal);
    const filteredRows=interns.filter((row)=>{
      
      if( row.student_name.toString().toLowerCase().includes(searchVal.toString().toLowerCase()) ||
      row.student_email.toString().toLowerCase().includes(searchVal.toString().toLowerCase()) === true) {
        
        return true;
      }
      else return false;
    })
    setRows(filteredRows);
    

  }
  const cancelSearch=()=>{
    setSearched("");
    requestSearch(searched);
  }
  const isSelected = (company) => selected.indexOf(company) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const formatValue = (value) => value.toFixed(0);
  return (
    

    <Box sx={{ width: '100%' }}>
    <Paper sx={{ width: '100%', mb: 2 }}>
      <SearchBar
      value={searched}
      onChange={(searchVal) => requestSearch(searchVal)}
      onCancelSearch={() => cancelSearch()}
      style={{border:'3px solid rgba(0, 0, 0, 0.05)'}}
    />
    <Grid container style={{backgroundColor:'#595e5a', color:"white"}}>
    
      
      </Grid>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody >
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.company);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      key={row.s_no}
                    >
                      
                      <TableCell component="th" id={labelId} scope="row" padding="3px">
                        {row.s_no}
                      </TableCell>
                      <TableCell align="left">{row.student_name}</TableCell>
                      <TableCell align="left">{row.student_email}</TableCell>
                      <TableCell align="left">{row.tab_change_count}</TableCell>
                      <TableCell align="right">{row.ctrl_press_count}</TableCell>
                      <TableCell align="right">{row.alt_press_count}</TableCell>
                      <TableCell align="right">{row.full_screen_exit_count}</TableCell>
                      <TableCell align="right">{row.mobile_found_count}</TableCell>
                      <TableCell align="right">{row.prohibited_object_found_count}</TableCell>
                      {/*<TableCell align="left"><Button variant="contained" color="primary" onClick={(e)=>handleViewvulnerabilities(e,row.scan_id)}>View vulnerabilities</Button></TableCell>
                  <TableCell align="left"><Button variant="contained" color="secondary" onClick={(e)=>handleRescan(e,row.scan_id, row.type)}>Rescan</Button></TableCell>*/}
                      
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      </Box>

  );
}