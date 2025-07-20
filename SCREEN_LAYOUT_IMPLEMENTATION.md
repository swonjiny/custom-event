# Screen Layout Implementation

This document describes the screen layout functionality implemented in the application.

## Overview

The application now supports creating and managing screen layouts with cards positioned in specific locations. Each card can be collapsed, expanded, and configured in various ways. There's also a central menu at the bottom center that can have priority over other cards and expand to cover the entire screen.

## Components

The implementation consists of the following components:

1. **LayoutCard** - A component for displaying content in the screen layout
   - Properties: title, position, horizontalCollapse, verticalCollapse, titleOnly, expanded
   - Controls for toggling each state
   - Dynamic styling based on state

2. **CentralMenu** - A component for the bottom center of the screen layout
   - Properties: priority, expanded
   - Controls for toggling each state
   - When expanded and has priority, it covers the entire screen and causes other cards to collapse

3. **ScreenLayout** - A component for managing the overall layout
   - Arranges cards in a 2x2 grid (2 on the left, 2 on the right)
   - Positions the central menu at the bottom center
   - Manages the state of all cards and the central menu
   - Handles saving and loading layouts from the API

4. **ScreenLayoutPage** - A page component for displaying and managing screen layouts
   - Lists all layouts with options to view, edit, and delete
   - Provides search functionality
   - Includes modals for creating/editing and viewing layouts

## API Endpoints

The following API endpoints are used for screen layouts:

1. `POST /api/screen-layouts` - Create a new screen layout
2. `GET /api/screen-layouts/{layoutId}` - Get a specific layout by ID
3. `GET /api/screen-layouts` - Get all layouts
4. `PUT /api/screen-layouts/{layoutId}` - Update a layout
5. `DELETE /api/screen-layouts/{layoutId}` - Delete a layout

## How to Use

1. Navigate to the "화면 레이아웃" (Screen Layout) page using the link in the navigation menu
2. To create a new layout, click the "새 레이아웃" (New Layout) button
3. In the layout editor:
   - Each card has controls for horizontal collapse, vertical collapse, title-only mode, and expansion
   - The central menu has controls for priority and expansion
   - Click "저장" (Save) to save the layout
4. To view an existing layout, click the "보기" (View) button next to it in the list
5. To edit an existing layout, click the "수정" (Edit) button
6. To delete a layout, click the "삭제" (Delete) button and confirm

## Testing

To test the screen layout functionality:

1. **Creating a new layout**
   - Navigate to the Screen Layout page
   - Click "새 레이아웃" (New Layout)
   - Verify that the layout editor appears with the default configuration
   - Click "저장" (Save)
   - Verify that the new layout appears in the list

2. **Card collapse/expand functionality**
   - Open a layout in view or edit mode
   - Click the horizontal collapse button on a card
   - Verify that the card becomes narrow
   - Click the vertical collapse button
   - Verify that the card becomes short
   - Click the title-only button
   - Verify that only the title is shown
   - Click the expand button
   - Verify that the card expands to fill the screen and other cards are not expanded

3. **Central menu priority and expansion**
   - Open a layout in view or edit mode
   - Click the priority button on the central menu
   - Verify that the central menu's z-index increases
   - Click the expand button
   - Verify that the central menu expands to cover the entire screen
   - Verify that other cards collapse horizontally

## Sample Layout JSON

Here's an example of the JSON structure for a screen layout:

```json
{
  "name": "기본 레이아웃",
  "cards": [
    {
      "position": "LEFT_1",
      "title": "왼쪽 상단 카드",
      "horizontalCollapse": false,
      "verticalCollapse": false,
      "titleOnly": false,
      "expanded": false
    },
    {
      "position": "LEFT_2",
      "title": "왼쪽 하단 카드",
      "horizontalCollapse": false,
      "verticalCollapse": false,
      "titleOnly": false,
      "expanded": false
    },
    {
      "position": "RIGHT_1",
      "title": "오른쪽 상단 카드",
      "horizontalCollapse": false,
      "verticalCollapse": false,
      "titleOnly": false,
      "expanded": false
    },
    {
      "position": "RIGHT_2",
      "title": "오른쪽 하단 카드",
      "horizontalCollapse": false,
      "verticalCollapse": false,
      "titleOnly": false,
      "expanded": false
    }
  ],
  "centralMenu": {
    "priority": false,
    "expanded": false
  }
}
```

## Notes

- The screen layout functionality is implemented as a client-side feature that communicates with the backend API
- The actual backend implementation of the API endpoints needs to be in place for the functionality to work properly
- The implementation includes error handling and loading states to provide a good user experience
