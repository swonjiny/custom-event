# API Fallback Implementation

This document describes the fallback mechanism implemented in the application to handle API failures gracefully.

## Overview

The application now includes a fallback mechanism that returns default data when API calls fail. This ensures that the application can continue to function even when the backend server is unavailable or returns errors.

The fallback mechanism has been implemented in the following service files:
- `noticeService.js`
- `boardService.js`
- `commentService.js`
- `databaseService.js`
- `screenLayoutService.js`

## How It Works

Each service file has been modified to:
1. Define default data objects that match the expected structure of the API responses
2. Catch errors that occur during API calls
3. Return the appropriate default data instead of throwing the error

This allows the application to continue functioning with meaningful data even when API calls fail.

## Default Data

Each service file includes default data that is returned when API calls fail:

### noticeService.js

- `DEFAULT_NOTICES`: An array of notice objects with properties like id, title, content, createdAt, and updatedAt.

### boardService.js

- `DEFAULT_BOARDS`: An array of board objects with properties like boardId, title, writer, content, createdDate, modifiedDate, viewCount, and files.
- `DEFAULT_PAGINATION`: An object with pagination information that includes the DEFAULT_BOARDS array.

### commentService.js

- `DEFAULT_COMMENTS`: A hierarchical array of comment objects with nested children, including properties like commentId, boardId, parentCommentId, content, writer, createdDate, modifiedDate, and children.

### databaseService.js

- `DEFAULT_DATABASE_TYPE`: An object with a databaseType property set to 'MARIADB'.

### screenLayoutService.js

- `DEFAULT_LAYOUT`: A single layout object with properties like layoutId, name, cards, and centralMenu.
- `DEFAULT_LAYOUTS`: An array of layout objects that includes DEFAULT_LAYOUT and another layout with a different configuration.

## Modified Functions

The following functions have been modified to return default data when API calls fail:

### noticeService.js

- `getNotices()`: Returns DEFAULT_NOTICES
- `getNoticeById(id)`: Returns a matching notice from DEFAULT_NOTICES or the first notice if no match is found
- `createNotice(noticeData)`: Returns a success response with a new random ID and the provided data
- `updateNotice(id, noticeData)`: Returns a success response with the updated data
- `deleteNotice(id)`: Returns a success response with a message indicating the notice was deleted

### boardService.js

- `getBoards(page, size)`: Returns DEFAULT_PAGINATION
- `getBoardById(id)`: Returns a matching board from DEFAULT_BOARDS or the first board if no match is found
- `createBoard(boardData, files)`: Returns a success response with a new random ID, the provided data, and default file objects for any files that were provided
- `updateBoard(id, boardData, files)`: Returns a success response with the updated data and default file objects for any files that were provided
- `deleteBoard(id)`: Returns a success response with a message indicating the board was deleted

### commentService.js

- `getNestedCommentsByBoardId(boardId)`: Returns filtered comments from DEFAULT_COMMENTS for the specified board ID
- `createComment(commentData)`: Returns a success response with a new random ID and the provided data
- `createNestedComment(commentData)`: Returns a similar success response for nested comments
- `getCommentsByBoardId(boardId)`: Returns a flattened version of the nested comments structure, filtered by the specified board ID
- `getCommentById(commentId)`: Returns a matching comment from the nested structure or the first comment if no match is found
- `updateComment(commentId, commentData)`: Returns a success response with the updated data
- `deleteComment(commentId)`: Returns a success response with a message indicating the comment was deleted

### databaseService.js

- `switchDatabase(databaseType)`: Returns a success response with the provided database type and a success message
- `getCurrentDatabaseType()`: Returns DEFAULT_DATABASE_TYPE

### screenLayoutService.js

- `createScreenLayout(layoutData)`: Returns a success response with a new random ID and the provided data
- `getScreenLayouts()`: Returns DEFAULT_LAYOUTS
- `getScreenLayoutById(layoutId)`: Returns a matching layout from DEFAULT_LAYOUTS or DEFAULT_LAYOUT if no match is found
- `updateScreenLayout(layoutId, layoutData)`: Returns a success response with the updated data
- `deleteScreenLayout(layoutId)`: Returns a success response with a message indicating the layout was deleted

## Benefits

This fallback mechanism provides several benefits:
1. **Improved User Experience**: Users can continue to use the application even when the backend is unavailable.
2. **Graceful Degradation**: The application degrades gracefully instead of showing error messages or crashing.
3. **Easier Development and Testing**: Developers can work on the frontend without needing the backend to be fully functional.
4. **Offline Capability**: The application can provide some functionality even when offline.

## Limitations

The fallback mechanism has some limitations:
1. **Data Freshness**: The default data is static and may not reflect the latest data from the backend.
2. **Write Operations**: While the application will appear to successfully create, update, or delete data, these changes won't actually be persisted to the backend when it's unavailable.
3. **Consistency**: If the backend becomes available again, there may be inconsistencies between the default data shown to the user and the actual data in the backend.

## Testing

To test the fallback mechanism:
1. Start the application with the backend server running.
2. Use the application normally to verify that it works with the real API.
3. Stop the backend server or disconnect from the network.
4. Continue using the application and verify that it still functions with the default data.
5. Check the browser console to see log messages indicating that default data is being returned.

## Conclusion

The fallback mechanism provides a more robust user experience by ensuring that the application can continue to function even when API calls fail. This is particularly useful during development, testing, and in situations where the backend server may be temporarily unavailable.
