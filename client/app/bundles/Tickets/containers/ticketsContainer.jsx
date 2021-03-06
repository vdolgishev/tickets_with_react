import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreateForm from '../components/CreateForm';
import EditShowForm from '../components/EditShowForm';
import Tickets from '../components/Tickets';

import * as ticketsActions from '../actions/ticketsActions';

const TicketsContainer = ({ actions, ticketsData }) => {
  return (
    <div>
      <CreateForm isShown= {ticketsData.showCreateForm} actions={actions} states={ticketsData.states}/>
      <EditShowForm data={ticketsData.modal} actions={actions} tickets= {ticketsData.tickets} states={ticketsData.states} />
      <Tickets {...{actions, ticketsData}} />
    </div>
  );
};

TicketsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  ticketsData: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    ticketsData: state.ticketsData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      onTicketClick: (id) => { dispatch(ticketsActions.showTicket(id)) },
      onTicketDeleteClick: (id, e) => {
        e.stopPropagation();
        dispatch(ticketsActions.deleteTicket(id, dispatch))
      },
      closeModalClick: () => { dispatch(ticketsActions.closeTicket()) },
      updateTicketClick: (ticket) => { dispatch(ticketsActions.updateTicket(ticket)) },
      onEditClick: () => { dispatch(ticketsActions.editTicket()) },
      showCreateForm: ()=> { dispatch(ticketsActions.showCreateForm())},
      closeCreateForm: ()=> { dispatch(ticketsActions.closeCreateForm())},
      createTicketClick: (ticket)=> { dispatch(ticketsActions.createTicket(ticket))},
      addTicketFromSockets: (ticket) => { dispatch(ticketsActions.addTicketFromSockets(ticket))},
      updateTicketFromSockets: (ticket) => { dispatch(ticketsActions.resolvedUpdateTicket(ticket, dispatch))},
      deleteTicketFromSockets: (ticketId) => { dispatch(ticketsActions.resolvedDeleteTicket(ticketId)) }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketsContainer);
