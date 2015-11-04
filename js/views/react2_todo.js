import React from 'react';
import _ from 'underscore';
import {TodoCollection, TodoModel} from '../resources';

export default React.createClass({  

  submitClickHandler(e) {
    this.model = new TodoModel;
    e.preventDefault();

    this.model.find('.fa-plus')
      .removeClass('fa-plus')
      .addClass('fa-spin')
      .addClass('fa-spinner');

    let data = this.model.get('form').toJSON();

    this.collection.add(data).save().then(() => this.render());
  },

  isComplete() {
    return !!this.get('completeAt');
  },

  removeClickHandler(e) {
    e.preventDefault();

    let $button = e.currentTarget.value;

    let id = $button.data('id');

    let model = this.collection.get(id);

    $button.find('.fa-close')
      .removeClass('fa-close')
      .addClass('fa-spin')
      .addClass('fa-spinner');

    model.save({
      completeAt: new Date().toString()
    }).then(() => this.render());
  },

  undoClickHandler(e) {
    e.preventDefault();

    let $button = e.currentTarget.value;

    let id = $button.data('id');

    let model = this.collection.get(id);

    $button.find('.fa-undo')
      .removeClass('fa-undo')
      .addClass('fa-spin')
      .addClass('fa-spinner');

    model.save({
      completeAt: null
    }).then(() => this.render());
  },

  clearClickHandler(e) {
    e.preventDefault();

    this.showSpinner();

    this.props.find('footer .clear').remove();

    let completeModels = this.collection.filter((model) => {
      return model.isComplete();
    });
    
    let deleteRequests = completeModels.map(m => m.destroy());
  
    this.render();

  },

  showSpinner() {
      return (
        <div class="clearing">
          <div class="spinner">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <h4>Deleting Complete Todos</h4>
        </div>
      );
  },

  rootElement() {
    return (
      <div></div>
    ).addClass('todo-collection');
  },

  wrapData(model) {
    // check of the model is complete
  let complete = model.isComplete();
  
  // show a different icon based on if model is complete
  let fa = complete ? 'undo' : 'close';
  let faText = "fa fa-" + fa;

  // use a different action based on if model is complete
  let action = complete ? 'undo' : 'remove';

  let title = "title " + complete ? 'complete' : '';
  
  // define our template
  return (
    <li className="todo">
      <span className={title}>
        {this.model.get('title')}
      </span>
      <button className={action} data-id={this.model.id}>
        <i className={faText}></i>
      </button>
    </li>
    );
  },

  processData(model) {    
    this.collection = new TodoCollection;   

    let jcollect = this.collection.toJSON();
    jcollect.map(this.wrapData(model))
      return this;
  
  },

  render() {
    this.model = new TodoModel();
    return (
      <div>
        <header>
          <h1>Things Todo</h1>
        </header>

        <main>
          <form className="todo-add">
            <input type="text" name="title" placeholder="Add Something"/>
            <button onClick={this.submitClickHandler}><i className="fa fa-plus"></i></button>
          </form>
          <ul className="todo-list">{this.processData()}</ul>
        </main>

        <footer>
          <button onClick={this.clearClickHandler} className="clear">Clear Complete</button>
        </footer>
      </div>
    );
  }

});



