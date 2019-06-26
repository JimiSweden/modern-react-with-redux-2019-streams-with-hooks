import React from 'react';
import { Field, reduxForm } from 'redux-form';

/**
 * Shared form: Edit and Create
 */
const StreamForm = (props) => {
    //note: no need to do event.preventDefault when using redux-form
    const onSubmit = (formValues) => {
        // console.log('on submit handled: ', formValues)
        /*important: as we added the createStream inside onSubmit, 
        onSubmit had to be moved inside the component (i e to get props from redux)
        */
        props.onSubmit(formValues);
    }

    return (
        <div>
            <label htmlFor="createStreamForm">
                Create a new stream
            </label>
            <form
                name="createStreamForm"
                // note: form needs className 'error' to display errors
                className="ui form error"
                // handleSubmit is provided by redux-form
                onSubmit={props.handleSubmit(onSubmit)}
            >
                {/* 
                    this example would not get a label rendered: 
                    <Field name="example" component="input" label="a label" /> 
                */}
                <Field
                    name="title"
                    label="Enter Title"
                    //label (i.e. unknown props) will be passed to component
                    component={renderInput}
                />
                <Field
                    name="description"
                    label="Enter Description"
                    component={renderInput}
                />
                {/* <Field name="checkbox" component={checkBox} /> */}

                <button className="ui button primary">Submit</button>
            </form>
        </div>
    )
};

/*
    https://redux-form.com/8.2.2/docs/api/field.md/#usage

    NOTE: functions need to be outside of component, 
    else they will be re rendered 
    and thus focus will be lost after first input 
    (because first input will cause a re render)
*/
//todo: implementera en checkbox - https://reactjs.org/docs/forms.html
// const checkBox = ({ input }) => {
//     // console.log('checkbox props', input)
//     return (
//         <input {...input} type="checkbox" />
//     );
// };


//this will render a semantic ui error box, 
//I think it is too much when we also make the field red
// const renderErrorAsInCourse = (meta) => {
//     return (
//         //NOTE; no need to heck if valid here, .error will be undefined when valid
//         // meta.dirty && meta.error ?
//         //meta.visited && !meta.active && meta.error ?
//         shouldDisplayError(meta) ?
//             <div className="ui error message">
//                 {/* note: form needs className 'error' to display errors*/}
//                 <div className="header">{meta.error}</div>
//             </div>
//             : null
//     )
// }

const shouldDisplayError = (meta) => {
    return meta.touched && meta.error;
}

const renderError = (meta) => {
    return (
        shouldDisplayError(meta) ?
            <div>  - {meta.error.toUpperCase()}</div>
            : null
    )
}

//when doing more than just an input field, use a function

const renderInput = ({ input, label, meta }) => {

    // console.log('meta ', meta)
    // console.log('render input: ', input)


    //adding error on the input will make it red.
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;

    return (
        <div className={className}>
            <label htmlFor={input.name}>
                {label} {renderError(meta)}
            </label>
            {/* destruct all input props  */}
            <input {...input} autoComplete="off" />

        </div>
    );
};


/**
 *  validation runs on all interactions and renders
 * return empty object if no errors,
 *  else return object with key-value pairs for each invalid field
 * errors matching a field name will be passed down to the props in <Field />
*/
const validateForm = (formValues) => {

    // console.log('validating - ', formValues);
    const errors = {};

    if (!formValues.title) {
        errors.title = 'is required'
    }

    if (!formValues.description) {
        errors.description = 'is required'
    }

    // console.log('validating - errors: ', errors);
    return errors;
}

const formWrapped = reduxForm({
    //streamCreate needs to be a unique form name and will be the name stored in redux - todo: make type names.
    form: 'streamForm', //from props?
    validate: validateForm
    //https://redux-form.com/7.1.0/examples/initializefromstate/
    //initialValues, property names must match the Field names to be initialized
    // when passed as parameter as now we dont set the initalValues here, 
    //but if loading from state we would need to use connect and mapStateToProps - se link above
    // return {initialValues: state.dataToInitializeWith }
})(StreamForm);

export default formWrapped;

