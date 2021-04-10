import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { default as MuiButton } from '@material-ui/core/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Goods from '../components/Goods';
import { getGoods, addGoods } from '../store/actions';
import { swalFire, swalCalculate, toastSuccess } from '../styling/swal';
import inputValidation from '../helper/inputValidation';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    maxWidth: 1100,
    margin: '10px auto 0',
    border: '1px solid #000'
  },
  buttonAdd: {
    display: 'inline-block',
    marginLeft: '1150px',
    marginTop: '10px'
  },
  buttonCalculate: {
    display: 'inline-block',
    marginLeft: '660px',
    marginTop: '20px'
  },
  page: {
    height: '100vh',
    backgroundColor: '#FAF2D0'
  }
});

function Home() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [thisGoods, setThisGoods] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [imported, setImported] = useState(false);
  const goods = useSelector(state => state.goods.goods);

  const classes = useStyles();

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setThisGoods('');
    setQuantity('');
    setPrice('');
    setType('');
    setImported(false);
    setShow(false)
  };

  function handleSubmit(e) {
    e.preventDefault();
    const validate = inputValidation(thisGoods, quantity, price, type);
    if (validate === 'fill_input') {
      swalFire('All inputs need to be filled!');
    } else if (validate === 'negative_quantity') {
      swalFire('Quantity has to be positive value!');
    } else if (validate === 'negative_price') {
      swalFire('Price has to be positive value!'); 
    } else {
      let tax = 0;
      if (type === 'Other') {
        tax += 10;
      } 
      if (imported) {
        tax += 5;
      }
      tax = price * quantity * (tax / 100);
      tax = (Math.ceil(tax * 20) / 20).toFixed(2);
      const newData = {
        id: +(new Date()),
        name: thisGoods,
        quantity,
        originalPrice: +price,
        price: (+price * +quantity) + +tax,
        type,
        imported,
        tax
      }
      dispatch(addGoods(newData));
      setThisGoods('');
      setQuantity('');
      setPrice('');
      setType('');
      setImported(false);
      toastSuccess('Goods added successfully');
      handleClose();
    }
  }

  const handleCalculate = (e) => {
    e.preventDefault();
    let totalTax = 0;
    let totalPrice = 0;
    goods.forEach(goods => {
      totalTax += +goods.tax;
      totalPrice += +goods.price;
    })
    swalCalculate(totalTax, totalPrice);
  }

  useEffect(() => {
    dispatch(getGoods(goods))
  }, [dispatch]);

  return (
    <div className={classes.page}>
      <h1 style={{ margin: '0 auto', paddingTop: '20px', textAlign: 'center' }}>Sales Goods Calculator</h1>
      {
        goods.length === 0 ? (
          <div>
            <h4 style={{ textAlign: 'center', paddingTop: '20px' }}>No goods added yet. Add some goods!</h4>
            <MuiButton variant="contained" className={classes.buttonCalculate} color="primary" onClick={handleShow}>Add Goods</MuiButton>
          </div>
        ): 
      <TableContainer>
        <MuiButton variant="contained" className={classes.buttonAdd} color="primary" onClick={handleShow}>Add Goods</MuiButton>
        <Table className={classes.table} size="medium" aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">#</StyledTableCell>
              <StyledTableCell align="center">Goods</StyledTableCell>
              <StyledTableCell align="center">Quantity</StyledTableCell>
              <StyledTableCell align="center">Price</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Imported</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
              <StyledTableCell align="center">Tax</StyledTableCell>
              <StyledTableCell align="center">Total Price</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goods.map((good, index) => (
              <Goods good={good} index={index} key={good.name} />
            ))}
              {/* <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="center">
                &nbsp;
                </StyledTableCell>
                <StyledTableCell align="center">&nbsp;</StyledTableCell>
                <StyledTableCell align="center">&nbsp;</StyledTableCell>
                <StyledTableCell align="center">&nbsp;</StyledTableCell>
                <StyledTableCell align="center">&nbsp;</StyledTableCell> 
                <StyledTableCell align="center"><h5>Total:</h5></StyledTableCell>
                <StyledTableCell align="center"><h5>This Much</h5></StyledTableCell>
                <StyledTableCell align="center"><h5>This Much</h5></StyledTableCell>
              </StyledTableRow> */}
          </TableBody>
        </Table>
      </TableContainer>
      }
      { goods.length === 0 ? <> </> : <MuiButton variant="contained" onClick={handleCalculate} className={classes.buttonCalculate}>Calculate All</MuiButton> }
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add Goods</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formGoods">
            <Form.Label>Goods</Form.Label>
            <Form.Control value={thisGoods} onChange={(e) => setThisGoods(e.target.value)} type="text" placeholder="Enter goods" />
          </Form.Group>
          <Form.Group controlId="formQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" placeholder="Quantity" />
          </Form.Group>
          <Form.Group controlId="formQuantity">
            <Form.Label>Price (Each)</Form.Label>
            <Form.Control value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Price" />
          </Form.Group>
          <Form.Group controlId="formType">
            <Form.Label>Type</Form.Label>
            <Form.Control value={type} onChange={(e) => setType(e.target.value)} as="select">
              <option value="">=== ENTER GOODS TYPE ===</option>
              <option>Books</option>
              <option>Food</option>
              <option>Medical Products</option>
              <option>Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check value={imported} onChange={(e) => setImported(e.target.checked)} type="checkbox" label="Imported" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">Add</Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default Home;