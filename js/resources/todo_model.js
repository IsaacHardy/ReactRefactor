import Backbone from 'backbone';
import {APP_URL} from '../parse_auth';


const TodoModel = Backbone.Model.extend({
  urlRoot: APP_URL,
  idAttribute: 'objectId',
  
});

export default TodoModel;
