/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Delete an item
*
* id UUID 
* no response value expected for this operation
* */
const itemsIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update an item
*
* id UUID 
* item Item 
* no response value expected for this operation
* */
const itemsIdPUT = ({ id, item }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        item,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create a new item
*
* item Item 
* no response value expected for this operation
* */
const itemsPOST = ({ item }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        item,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete a page
*
* id UUID 
* no response value expected for this operation
* */
const pagesIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update a page
*
* id UUID 
* page Page 
* no response value expected for this operation
* */
const pagesIdPUT = ({ id, page }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        page,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create a new page
*
* page Page 
* no response value expected for this operation
* */
const pagesPOST = ({ page }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        page,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  itemsIdDELETE,
  itemsIdPUT,
  itemsPOST,
  pagesIdDELETE,
  pagesIdPUT,
  pagesPOST,
};
