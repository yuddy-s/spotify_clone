import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const db = require('../db')
const testData = require('./data/example-db-data.json');


/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager 
 * will perform all necessarily operations properly.
 *  
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 * 
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(async () => {
    // SETUP THE CONNECTION VIA MONGOOSE JUST ONCE - IT IS IMPORTANT TO NOTE THAT INSTEAD
    // OF DOING THIS HERE, IT SHOULD BE DONE INSIDE YOUR Database Manager (WHICHEVER)
    await db.connect();
});

/**
 * Executed before each test is performed.
 */
beforeEach(async () => {
    let resetDB;
    if (process.env.DB_TYPE === 'mongodb') {
        resetDB = require('./data/mongo');
    } else {
        resetDB = require('./data/postgre');
    }
    await resetDB();
});

/**
 * Executed after each test is performed.
 */
afterEach(async () => {
    let resetDB;
    if (process.env.DB_TYPE === 'mongodb') {
        resetDB = require('./data/mongo');
    } else {
        resetDB = require('./data/postgre');
    }
    await resetDB();
});

/**
 * Executed once after all tests are performed.
 */
afterAll(async () => {
    await db.disconnect();
});

/**
 * Vitest test to see if the Database Manager can get a User.
 */
test('Test #1) Reading a User from the Database', async () => {
    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
            firstName: "Joe",
            lastName: "Shmo",
            email: "joe@shmo.com",
            passwordHash: "$2a$10$dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm.ATbQ4sJk4agGu",
            playlists: [
                "68f524b611e0f3901871f164",
                "68f526c1ec1ea2ad00a6fae0"
            ]
        }

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    let actualUser = {};

    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)
    actualUser = await db.findOne('User', { email: expectedUser.email })

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(actualUser.firstName).toBe(expectedUser.firstName)
    expect(actualUser.lastName).toBe(expectedUser.lastName)
    expect(actualUser.email).toBe(expectedUser.email)
    // AND SO ON
});

/**
 * Vitest test to see if the Database Manager can create a User
 */
test('Test #2) Creating a User in the Database', async () => {
    // MAKE A TEST USER TO CREATE IN THE DATABASE
    const testUser = {
        // FILL IN TEST DATA, INCLUDE AN ID SO YOU CAN GET IT LATER
        firstName: "Ariv",
        lastName: "Cheese",
        email: "ariv@cheese.com",
        passwordHash: "$2a$10$dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm.ATbQ4sJk4agGu",
        playlists: []
    };

    // CREATE THE USER
    // dbManager.somethingOrOtherToCreateAUser(...)
    await db.create('User', testUser)
    // NEXT TEST TO SEE IF IT WAS PROPERLY CREATED

    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        // FILL IN EXPECTED DATA
        firstName: "Ariv",
        lastName: "Cheese",
        email: "ariv@cheese.com",
        passwordHash: "$2a$10$dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm.ATbQ4sJk4agGu",
        playlists: []
    };

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    let actualUser = {};

    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)
    actualUser = await db.findOne('User', { firstName: testUser.firstName })
    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(actualUser.firstName).toBe(testUser.firstName)
    expect(actualUser.lastName).toBe(testUser.lastName)
    expect(actualUser.email).toBe(testUser.email)
    // AND SO ON

});

// THE REST OF YOUR TEST SHOULD BE PUT BELOW
// findOne and create already tested in previous tests so I wont repeat

// Testing findAll()
test('Test #3) Reading All Users in the Database', async () => {
    const users = await db.findAll('User');
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(3);
})

// testing findById
test('Test #4) Using findById for Reading a User in the Database', async () => {
    const existingUser = await db.findOne('User', { email: 'joe@shmo.com' })
    const userById = await db.findById('User', existingUser._id);

    expect(userById).not.toBeNull();
    expect(userById.email).toBe(existingUser.email);
})

// testing findOneAndDelete
test('Test #5) Deleting a user with findOneAndDelete', async () => {
    const targetEmail = 'joe@shmo.com';
    const deletedUser = await db.findOneAndDelete('User', { email: targetEmail })

    expect(deletedUser).not.toBeNull();
    const actualUser = await db.findOne('User', { email: targetEmail })
    expect(actualUser).toBeNull();
})

// testing update
test('Test #6) Updating a user`s data with update()', async () => {
    const targetEmail = 'joe@shmo.com';
    await db.update('User', { email: targetEmail }, { lastName: "updated" })

    const actualUser = await db.findOne('User', { email: targetEmail })
    expect(actualUser.lastName).toBe("updated")
})