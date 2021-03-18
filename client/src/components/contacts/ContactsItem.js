import React, { useContext } from 'react';
import ContactContext from '../../context/contact/contactContext';
import PropTypes from 'prop-types';

export const ContactsItem = ({ contact }) => {
  const contactContext = useContext(ContactContext);
  const { _id, name, email, phone, type } = contact;
  const { deleteContact, setCurrent, clearCurrent } = contactContext;

  const onSubmit = () => {
    deleteContact(_id);
    clearCurrent();
  };
  return (
    <div className='card bg-light'>
      <h3 className='text-primary text-left'>
        {name}{' '}
        <span
          style={{ float: 'right' }}
          className={'badge ' + (type === 'professional' ? 'badge-success' : 'badge-primary')}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </h3>
      <ul className='List'>
        {email && (
          <li>
            <i className='fas fa-envelope-open'></i> {email}
          </li>
        )}
        {phone && (
          <li>
            <i className='fas fa-phone'></i> {phone}
          </li>
        )}
      </ul>
      <p>
        <button className='btn btn-dark btn-small' onClick={() => setCurrent(contact)}>
          Edit
        </button>
        <button className='btn btn-danger btn-small' onClick={onSubmit}>
          Delete
        </button>
      </p>
    </div>
  );
};

ContactsItem.prototype = {
  contact: PropTypes.object.isRequired,
};
export default ContactsItem;
