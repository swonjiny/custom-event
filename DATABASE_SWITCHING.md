# Database Switching Functionality

This document describes the database switching functionality implemented in the application.

## Overview

The application now supports switching between different database types (MARIADB and ORACLE) through a user interface. This functionality is implemented using a REST API endpoint and a React component.

## API Endpoints

The following API endpoints are used for database switching:

1. `POST /api/database/switch?databaseType=MARIADB|ORACLE`
   - Switches the database type used by the backend
   - Query parameter: `databaseType` (required) - The database type to switch to (MARIADB or ORACLE)
   - Returns: A response indicating the success or failure of the operation

2. `GET /api/database/type`
   - Gets the current database type being used by the backend
   - Returns: A response containing the current database type

## Frontend Implementation

The frontend implementation consists of the following components:

1. `databaseService.js` - A service file that provides functions to interact with the database API endpoints
2. `DatabaseSelector.jsx` - A component that provides a UI for switching between database types
3. `DatabaseConfig.jsx` - A page component that includes the DatabaseSelector component
4. Updates to the routing configuration to add the database configuration page
5. Updates to the navigation menu to include a link to the database configuration page

## How to Use

1. Navigate to the Database Config page using the link in the navigation menu
2. The current database type will be displayed
3. Select a database type (MARIADB or ORACLE) using the radio buttons
4. Click the "Switch Database" button to switch to the selected database type
5. A success or error message will be displayed indicating the result of the operation

## Backend Implementation Requirements

For this functionality to work, the backend needs to implement the following:

1. A controller/route for the `/api/database/switch` endpoint that accepts a `databaseType` query parameter
2. Logic to switch between MARIADB and ORACLE database types
3. A controller/route for the `/api/database/type` endpoint that returns the current database type
4. Proper error handling for invalid database types or other errors

## Testing

To test the database switching functionality:

1. Ensure the backend server is running and has implemented the required endpoints
2. Navigate to the Database Config page
3. Try switching between MARIADB and ORACLE database types
4. Verify that the current database type is updated correctly
5. Test error handling by trying to switch to an invalid database type (this is handled on the frontend, but should also be handled on the backend)

## Notes

- The database switching functionality is implemented as a client-side feature that communicates with the backend API
- The actual database switching logic needs to be implemented on the backend
- The frontend implementation includes error handling and loading states to provide a good user experience
