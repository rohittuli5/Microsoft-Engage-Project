import React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
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
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchBar from "material-ui-search-bar";

const axios = require('axios')

/**
 * Comparator function for descending sort
 * @param {Comparator} a 
 * @param {Comparator} b 
 * @param {String} orderBy asc or desc
 * @returns -1 if a>b, 1 if b>a 0 if equal
 */
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * Creates ascending and decending comparator
 * @param {String} order asc or desc
 * @param {*} orderBy 
 * @returns descendingComparator value (-1,0,1)
 */
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This function sorts an array given a comparator
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Array of the header cells of the table
// each element is an object containing that header cell's properties
const headCells = [
  { id: 's_no', numeric: false, disablePadding: false, label: 'S. No.' },
  { id: 'student_name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'student_email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'tab_change_count', numeric: true, disablePadding: false, label: 'Tab Changes' },
  { id: 'key_press_count', numeric: true, disablePadding: false, label: 'Prohibited Key Press' },
  { id: 'face_not_visible', numeric: false, disablePadding: false, label: 'Face Not Visible' },
  { id: 'multiple_faces_found', numeric: false, disablePadding: false, label: 'Multiple Faces Detected' },
  { id: 'mobile_found', numeric: false, disablePadding: false, label: 'Mobile Found' },
  { id: 'prohibited_object_found', numeric: false, disablePadding: false, label: 'Prohibited Object Found' },
];

/**
 * Creates the Table Head
 * @param {Props} props 
 * @returns rendering component
 */
function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy===headCell.id ?order:false}
          >
            <TableSortLabel
              active={orderBy===headCell.id}
              direction={orderBy===headCell.id?order:'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
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

/**
 * This function is the main function of this file
 * It creates the whole table
 * @returns renders the table
 */
export default function LogsTable(props) {
  const [exam_code, setExamCode] = React.useState("");
  const [visibility, setVisibility] = React.useState(false);
  const [error_text, setErrorText] = React.useState("");
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('company');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows,setRows]=React.useState([]);
  const [TableData,setTableData]=React.useState([]);
  const [searched, setSearched] = React.useState("");


  /**
   * Gets student logs from the server using the exam code and professor's email
   * and updates the table
   * 
   */
  const getData=async ()=>{
    try {
      // check if exam code is valid and it is one of professor's exams
      axios.get('/api/exams/examsByProf?exam_code='+exam_code+'&prof_email='+props.prof_email)
      .then(function (response) {
          console.log(response);
          // exam code valid, and permission is there so let it pass through
      })
      .catch(function (err) {
          console.log(err);
          // either exam code invalid or its not this professor's exam
          setErrorText("Either exam code is invalid or you dont have permission");
          // clear table and make it invisible.
          setVisibility(false);
          setTableData([]);
          setRows([]);
          return;
      });
      const response = await axios.post('/api/logs/allData',{exam_code:exam_code});
    
      setErrorText("");
      setVisibility(true);
      
      var curr_logs=[];
      // loop over the response and store it in the state
      for(var i=0;i<response.data.length;i++){
      
        var obj=new Object();
        obj.s_no=i+1;
        obj.student_name = response.data[i].student_name;
        obj.student_email = response.data[i].student_email;
        obj.tab_change_count = response.data[i].tab_change_count;
        obj.key_press_count = response.data[i].key_press_count;
        obj.face_not_visible = response.data[i].face_not_visible;
        obj.multiple_faces_found = response.data[i].multiple_faces_found;
        obj.mobile_found = response.data[i].mobile_found;
        obj.prohibited_object_found = response.data[i].prohibited_object_found;
        curr_logs=[...curr_logs,obj]
        
      }
      setTableData(curr_logs);
      setRows(curr_logs);
    }
    catch(err){
      console.error(err.message)
    }
  }


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
  
  /**
   * Filters rows based on the search string present in name or email of the student
   * @param {String} searchVal 
   */
  const requestSearch=(searchVal)=>{
  
    const filteredRows=TableData.filter((row)=>{
      // for each row of data check if name or email contains the search string
      if(row.student_name.toLowerCase().includes(searchVal.toLowerCase()) || row.student_email.toLowerCase().includes(searchVal.toLowerCase())) {
        
        return true;
      }
      else return false;
    })
    setRows(filteredRows);
    

  }
  /**
   * Cancels the search and sets the whole table to original position
   */
  const cancelSearch=()=>{
    setSearched("");
    requestSearch(searched);
  }
  const isSelected = (company) => selected.indexOf(company) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const formatValue = (value) => value.toFixed(0);

  return (
    

    <Box sx={{ width: '100%' }}>
    <TextField
      autoFocus
      padding="10px"
      margin="dense"
      variant="standard"
      id="exam_code"
      label="Exam Code"
      type="text"
      required={true}
      value={exam_code}
      onChange={(e)=>setExamCode(e.target.value)}
    />

    <button
      style={{
        width: "200px",
        borderRadius: "3px",
        letterSpacing: "1.5px",
        marginLeft:"10px",
        marginTop: "1rem"
      }}
      onClick={getData}
      className="btn btn-large waves-effect waves-light hoverable blue accent-3"
    >
      Check Logs
    </button>

    <br/>

    <p style={{color:"red", textAlign:"center"}}> {error_text} </p>

    {visibility === true && (<Paper sx={{ width: '100%', mb: 2 }}>
      
      <SearchBar
      value={searched}
      onChange={(searchVal) => requestSearch(searchVal)}
      onCancelSearch={() => cancelSearch()}
      style={{border:'3px solid rgba(0, 0, 0, 0.05)'}}
    />
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
                      
                      <TableCell component="th" id={labelId} scope="row" padding="normal">
                        {row.s_no}
                      </TableCell>
                      <TableCell align="left">{row.student_name}</TableCell>
                      <TableCell align="left">{row.student_email}</TableCell>
                      <TableCell align="right">{row.tab_change_count}</TableCell>
                      <TableCell align="right">{row.key_press_count}</TableCell>
                      <TableCell align="left">{row.face_not_visible === true? "Yes" : "No"}</TableCell>
                      <TableCell align="left">{row.multiple_faces_found === true ? "Yes" : "No"}</TableCell>
                      <TableCell align="left">{row.mobile_found === true ?"Yes" : "No"}</TableCell>
                      <TableCell align="left">{row.prohibited_object_found === true ?"Yes" : "No"}</TableCell>
                      
                      
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        
      </Paper>)}
      <br/>
      <br/>
      </Box>
      
  );
}