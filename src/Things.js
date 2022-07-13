import React from 'react';
import ThingForm from './ThingForm';
import { connect } from 'react-redux';
import { deleteThing, updateThing } from './store';
import axios from 'axios';

const Things = ({ things, users, deleteThing, increment, updateThing, getUsersThings })=> {
  return (
    <div>
      <h1>Things</h1>
      <ul>
        {
          things.map( thing => {
            const user = users.find(user => user.id === thing.userId) || {};
            return (
              <li key={ thing.id }>
                { thing.name } ({ thing.ranking })
                owned by { user.name || 'nobody' }

                <div>
                  <select defaultValue={ thing.userId } onChange={ ev => updateThing(thing, ev.target.value )}>
                    <option value=''>-- nobody --</option>
                    {
                      users.map( user => {
                        let owned = things.filter(thing => thing.userId === user.id);
                        if (owned.length < 3) {
                          return (
                            <option key={ user.id } value={ user.id }>
                              { user.name } (owns { owned.length } things)
                            </option>
                          );
                        } else {
                          return (
                            <option key={ user.id } value={ user.id } disabled>
                              { user.name } (owns { owned.length } things - max!)
                            </option>
                          );
                        }
                      })
                    }
                  </select>
                </div>
                <button onClick={ ()=> deleteThing(thing)}>x</button>
                <button onClick={()=> increment(thing, -1)}>-</button>
                <button onClick={()=> increment(thing, 1)}>+</button>
              </li>
            );
          })
        }
      </ul>
      <ThingForm />
    </div>
  );
};

export default connect(
  (state)=> {
    return {
      things: state.things,
      users: state.users
    }
  },
  (dispatch)=> {
    return {
      updateThing: (thing, userId)=> {
        thing = {...thing, userId: userId * 1 };
        dispatch(updateThing(thing));
      },
      increment: (thing, dir)=> {
        thing = {...thing, ranking: thing.ranking + dir};
        dispatch(updateThing(thing));
      },
      deleteThing: (thing)=> {
        dispatch(deleteThing(thing));
      }
    };

  }
)(Things);
