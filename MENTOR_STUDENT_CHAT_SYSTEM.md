# Mentor-Student Chat Request System

## Overview

This system enables students to browse mentor profiles and send chat requests to mentors. Mentors can view incoming requests, accept or decline them, and upon acceptance, a private one-on-one chat is established between the mentor and student.

## Features Implemented

### 1. Mentor Profile Browsing
- Students can view all available mentors on the `/mentors` page
- **Dashboard Integration**: Mentor profiles are now always visible on the student dashboard
- Mentors are displayed with their profiles, expertise, ratings, and availability
- Students can search mentors by name or expertise (both on dashboard and mentors page)
- Filter mentors by expertise areas
- Quick access from dashboard with "View All" button to navigate to full mentors page

### 2. Chat Request System
- **Student Side**: Students can send chat requests to mentors with a personalized message
- **Mentor Side**: Mentors receive real-time notifications of incoming chat requests
- **Request Management**: Mentors can accept or decline requests after viewing student profiles

### 3. Private Chat System
- Upon acceptance of a chat request, a private Stream Chat channel is created
- Only the mentor and student involved can access the chat
- Chat history is preserved and accessible through the dashboard

### 4. Real-time Updates
- Chat requests update in real-time using Firebase Firestore listeners
- Mentors see new requests immediately without page refresh
- Connection status updates automatically

## Components Created

### Frontend Components

#### 1. `ChatRequestModal.tsx`
- Modal for students to send chat requests to mentors
- Shows mentor profile information
- Includes message input for personalized introduction
- Handles request submission and error states

#### 2. `ChatRequestManagement.tsx`
- Component for mentors to view and manage incoming chat requests
- Displays request details and student information
- Provides accept/decline buttons with loading states
- Shows time stamps and request status

#### 3. `MentorshipChats.tsx`
- Displays active chat connections for both mentors and students
- Shows list of ongoing mentorship chats
- Provides quick access to open chat windows
- Handles both mentor and student perspectives

#### 4. Updated `MentorCard.tsx`
- Enhanced to show "Request Chat" button for students
- Integrates with the chat request modal
- Conditional rendering based on user role

#### 5. Updated `Mentors.tsx` Page
- Now fetches and displays real mentors from Firestore
- Includes search and filter functionality
- Shows mentor management interface for mentor users
- Integrated chat request system

#### 6. `MentorProfiles.tsx` Dashboard Component
- Displays mentor profiles directly on the student dashboard
- Shows up to 6 mentors in a compact grid format
- Includes search functionality for quick filtering
- Provides easy navigation to full mentors page
- Only visible to students, not mentors

### Backend Services

#### 1. `mentorshipService.ts`
- `fetchMentors()`: Retrieves all available mentors
- `sendChatRequest()`: Creates a new chat request
- `getMentorChatRequests()`: Real-time listener for mentor's incoming requests
- `acceptChatRequest()`: Accepts request and creates private chat channel
- `declineChatRequest()`: Declines a chat request
- `getStudentMentorships()`: Gets student's active mentorship connections
- `getMentorMentorships()`: Gets mentor's active mentorship connections

### Database Schema

#### 1. `chatRequests` Collection
```typescript
{
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  mentorId: string;
  mentorName: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. `mentorshipConnections` Collection
```typescript
{
  id: string;
  studentId: string;
  mentorId: string;
  status: 'active' | 'inactive' | 'ended';
  chatChannelId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Firestore Security Rules

Added comprehensive security rules for:
- Chat requests: Students can create, both parties can read, mentors can update
- Mentorship connections: Both parties can read, mentors can create and update
- User data access restrictions based on authentication

## User Flow

### For Students:
1. **Dashboard Access**: View mentor profiles directly on dashboard or navigate to `/mentors` page
2. **Search & Browse**: Use search functionality to find mentors by name or expertise
3. **Request Chat**: Click "Request Chat" on desired mentor from dashboard or mentors page
4. **Introduction**: Fill out personalized introduction message in modal
5. **Submit**: Send request and receive confirmation
6. **Monitor**: Check dashboard for request status and accepted requests
7. **Chat**: Access private chats through dashboard when mentors accept requests

### For Mentors:
1. Receive real-time chat request notifications on dashboard
2. View request details and student information
3. Accept or decline requests based on preferences
4. Access private chats with accepted students
5. Manage ongoing mentorship connections

## Integration Points

### Dashboard Integration
- **Students**: See "Available Mentors" section with searchable mentor profiles
- **Mentors**: See "Chat Request Management" section for incoming requests
- **Both users**: See "Mentorship Chats" section for active conversations
- Real-time updates without page refresh
- Quick navigation between dashboard and full pages

### Stream Chat Integration
- Private channels created with unique IDs
- Channel membership limited to mentor and student
- Full chat history and media sharing capabilities
- Mobile-responsive chat interface

## Privacy & Security

- **Private Chats**: Only participants can access chat channels
- **Data Protection**: User data secured with Firestore rules
- **Authentication**: All operations require valid user authentication
- **Request Validation**: Prevents duplicate requests and unauthorized access

## Future Enhancements

1. **Mentor Scheduling**: Add calendar integration for session scheduling
2. **Video Calls**: Integrate video calling capabilities
3. **Rating System**: Allow students to rate mentors after sessions
4. **Notification System**: Email/push notifications for chat requests
5. **Mentor Preferences**: Allow mentors to set availability and preferences
6. **Student Profiles**: Enhanced student profiles for mentors to review

## Technical Notes

- Uses Firebase Firestore for real-time data synchronization
- Stream Chat for messaging infrastructure
- React hooks for state management
- TypeScript for type safety
- Responsive design with Tailwind CSS

## Setup Requirements

1. Firebase project with Firestore enabled
2. Stream Chat account and API keys
3. Proper firestore.rules configuration
4. Node.js server for Stream Chat token generation

The system is fully functional and ready for use with proper Firebase and Stream Chat configuration.