import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { priceFormat } from '../helper/priceFormatter';
import { updateGoods, deleteGoods } from '../store/actions';
import { swalFire, swalConfirm, toastSuccess } from '../styling/swal';
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

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function Goods(props) {
  const good = props.good;
  const index = props.index;
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [thisGoods, setThisGoods] = useState(good.name);
  const [quantity, setQuantity] = useState(good.quantity);
  const [price, setPrice] = useState(good.originalPrice);
  const [type, setType] = useState(good.type);
  const [imported, setImported] = useState(good.imported);
  const existingGoods = useSelector(state => state.goods.goods);
  
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setThisGoods(good.name);
    setQuantity(good.quantity);
    setPrice(good.originalPrice);
    setType(good.type);
    setImported(good.imported);
    setShow(false)
  };

  function handleEdit(e) {
    e.preventDefault();
    const validate = inputValidation(thisGoods, quantity, price, type);
    if (validate === 'fill_input') {
      swalFire('All inputs need to be filled!');
    } else if (validate === 'negative_quantity') {
      swalFire('Quantity has to be positive value!');
    } else if (validate === 'negative_price') {
      swalFire('Price has to be positive value!'); 
    } else {
      const duplicateGoods = [...existingGoods];
      duplicateGoods.forEach(goods => {
        if (+goods.id === +good.id) {
          let tax = 0;
          if (type === 'Other') {
            tax += 10;
          } 
          if (imported) {
            tax += 5;
          }
          tax = price * quantity * (tax / 100);
          tax = (Math.ceil(tax * 20) / 20).toFixed(2);
          goods.name = thisGoods;
          goods.quantity = quantity;
          goods.originalPrice = price;
          goods.price = (+price * +quantity) + +tax;
          goods.type = type;
          goods.imported = imported;
          goods.tax = tax;
        }
      })
      dispatch(updateGoods(duplicateGoods));
      toastSuccess('Goods edited successfully!');
      handleClose();
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    const confirming = await swalConfirm();
    if (confirming.isConfirmed) {
      const filteredGoods = existingGoods.filter(goods => {
        return +goods.id !== good.id;
      })
      dispatch(deleteGoods(filteredGoods));
      toastSuccess('Goods deleted successfully!');
    }
  }

  return (
    <StyledTableRow key={good.name}>
      <StyledTableCell component="th" scope="row" align="center">
        {index + 1}
      </StyledTableCell>
      <StyledTableCell align="center">{good.name}</StyledTableCell>
      <StyledTableCell align="center">{good.quantity}</StyledTableCell>
      <StyledTableCell align="center">{priceFormat(good.originalPrice)}</StyledTableCell>
      <StyledTableCell align="center">{good.type}</StyledTableCell>
      <StyledTableCell align="center">{good.imported === true ? <i class="fas fa-check-circle"></i> : <i class="fas fa-times-circle"></i>}</StyledTableCell>
      <StyledTableCell align="center">
        <Button variant="primary" onClick={handleShow}><i className="fas fa-edit"></i></Button>
        <Button variant="danger" onClick={handleDelete} className="ml-4"><i className="fas fa-trash-alt"></i></Button>
      </StyledTableCell>
      <StyledTableCell align="center">{priceFormat(good.tax)}</StyledTableCell>
      <StyledTableCell align="center">{priceFormat(good.price)}</StyledTableCell>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={handleEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Goods</Modal.Title>
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
            <Form.Check checked={imported ? true : false} onChange={(e) => setImported(e.target.checked)} type="checkbox" label="Imported" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">Edit</Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </StyledTableRow>
  )
}

export default Goods;