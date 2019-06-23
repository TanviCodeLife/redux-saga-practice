import { takeLatest, call, put } from "redux-saga/effects";
import axios from 'axios';

// watcher saga: watches for actions dispatched to the store, starts worker saga
//takeLatest is a helper function provided by redux-saga that will trigger a new workerSaga when it sees an API_CALL_REQUEST, while cancelling any previously triggered workerSaga still in process.
export function* watcherSaga() {
    yield takeLatest("API_CALL_REQUEST", workerSaga);
}


//fetchDog function simply uses axios to request a random dog image from the Dog API and returns a Promise for the response.
function fetchDog() {
    return axios({
        method: "get",
        url: "https://dog.ceo/api/breeds/image/random"
    });
}

//worker saga: makes the api call when watcher saga sees the action 
//workerSaga attempts to fetchDog, using another redux-saga helper function 'call', and stores the result (a resolved or failed Promise) in a response variable.
function* workerSaga() {
    try {
        const response = yield call(fetchDog);
        const dog = response.data.message;

        // dispatch a success action to the store with the new dog
        yield put({ type: "API_CALL_SUCCESS", dog });
    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: "API_CALL_FAILURE", error });
    }
}