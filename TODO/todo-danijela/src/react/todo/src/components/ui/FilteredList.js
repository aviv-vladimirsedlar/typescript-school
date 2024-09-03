import React from 'react';
import TodoItem from './TodoItem';

export default function FilteredList(props) {
    const {items, changeStatus} = props;

    if (items.length === 0) {
        return (
            <p className="alert alert-info">No items!</p>
        );
    }

    return (
        <ul className="list-unstyled">
            {items.map(item => (
                <TodoItem key={item.id} data={item} changeStatus={changeStatus}/>
            ))}
        </ul>
    );
}
