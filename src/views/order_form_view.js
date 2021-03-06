import Backbone from 'backbone';
import Order from '../models/order';

const OrderFormView = Backbone.View.extend({
  initialize(params) {
    this.bus = params.bus;
    this.quotes = params.quotes;
  },
  render(quotes) {
    quotes.models.forEach((model) => {
      const symbol = model.attributes.symbol;
      this.$('select').append(`<option value=${symbol}>${symbol}</option>`);
    });
    return this;
  },
  events: {
    'click button.btn-buy': 'buyOrder',
    'click button.btn-sell': 'sellOrder',
  },
  buyOrder: function(event) {
    event.preventDefault();
    const order = new Order();
    this.getAttributes(event, order);
    this.checkValidity(order);
    // console.log(order);
    // TO DO: Reset form after submission
    },
  sellOrder: function(event) {
    event.preventDefault();
    const order = new Order();
    this.getAttributes(event, order);
    order.attributes.buy = false;
    this.checkValidity(order);
    // TO DO: Reset form after submission
  },
  checkValidity: function(order) {
    if (order.isValid()) {
      this.$('.form-errors').empty();
      this.$('input').empty();
      this.model.add(order);
    } else {
      this.$('.form-errors').empty();
      this.showErrors(order.validationError);
    }
  },
  showErrors: function(errors) {
    for (const key in errors) {
      const err = errors[key];
      err.forEach((message) => {
        this.$('.form-errors').append(`<h3>${message}</h3>`);
      })
    }
  },
  getAttributes: function(event, order) {
    order.attributes.symbol = event.target.form[0].value;
    order.attributes.targetPrice = parseFloat(event.target.form[1].value);
    order.bus = this.bus;
    order.legalQuotes = this.quotes.models;
    const currentQuotePrice = this.quotes.where({symbol: order.attributes.symbol})[0].attributes.price;
    order.currentQuotePrice = currentQuotePrice;

  }
});

export default OrderFormView;
