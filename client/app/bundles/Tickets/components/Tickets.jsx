import React, { PropTypes } from 'react';
import Ticket from '../components/Ticket';

export default class Tickets extends React.Component {
  static propTypes = {
    ticketsData: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      sort_type: 1,
      performerId: props.ticketsData.performerId
    };
  }

  sortStrings = (field, context) => {
    return function(e) {
      e.preventDefault();
      context.setState((prevState, props) => ({
        sort_type: prevState.sort_type * -1,
        tickets: props.ticketsData.tickets.sort(context.compareStrings(prevState.sort_type * -1, field))
      }));
    }
  };

  compareStrings(sort_type, field) {
    return function(a, b) {
      const getEl = function(el){
        const fields = field.split('.');
        if (fields.length > 1){
          return el[fields[0]][fields[1]]
        }
        else {
          return el[fields[0]]
        }
      };

      if (getEl(a) < getEl(b)) {
        return -1 * sort_type;
      } else{
        return sort_type;
      }
    }
  }

  sortDates = (e) => {
    e.preventDefault();
    this.setState((prevState, props) => ({
      sort_type: prevState.sort_type * -1,
      tickets: this.props.ticketsData.tickets.sort(this.compareDates(prevState.sort_type * -1))
    }));
  };

  compareDates(sort_type) {
    return function(a, b) {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      if (dateA < dateB){
        return -1 * sort_type;
      } else{
        return sort_type;
      }
    }
  }

  handleTicketsUpdate = (data)=> {
    let ticket = JSON.parse(data.ticket);

    switch (data.action) {
      case 'add':
        return this.props.actions.addTicketFromSockets(ticket);
      case 'update':
        return this.props.actions.updateTicketFromSockets(ticket);
      case 'delete':
        return this.props.actions.deleteTicketFromSockets(data.ticketId);
    }
  };

  componentDidMount() {
    this.setupSubscription();
  }

  setupSubscription () {
    App.tickets = App.cable.subscriptions.create(
      { channel: "TicketChannel" },
      {
        performerId: this.state.performerId,
        handleTicketsUpdate: this.handleTicketsUpdate,

        connected: function () {
          setTimeout(() =>
            this.perform('follow', { performer_id: this.performerId }),
            1000);
        },

        received: function (data) {
          this.handleTicketsUpdate(data);
        }
      }
    );
  };

  render() {
    return (
      <div className="tickets-block">
        <div>
          <button type="button" className="btn btn-primary" onClick={this.props.actions.showCreateForm}>Create Ticket</button>
        </div>
        <table className="table table-striped">
          <thead>
          <tr>
            <td onClick={this.sortStrings('description', this)}>Description</td>
            <td onClick={this.sortStrings('state', this)}>State</td>
            <td onClick={this.sortStrings('owner.first_name', this)}> Owner</td>
            <td onClick={this.sortStrings('performer.first_name', this)}> Performer</td>
            <td onClick={this.sortDates}>Created at</td>
            <td> Actions </td>
          </tr>
          </thead>
          <tbody>
            {this.props.ticketsData.tickets.map((ticket) =>
              <Ticket key={ticket.id} ticket={ticket} onTicketClick={() => this.props.actions.onTicketClick(ticket.id)} onDeleteClick={(e) => this.props.actions.onTicketDeleteClick(ticket.id, e)}/>)
            }
          </tbody>
        </table>
      </div>
    );
  }
}
