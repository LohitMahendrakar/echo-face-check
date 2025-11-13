# Face Recognition Attendance System - Backend Integration Guide

This frontend is ready to connect to your FastAPI backend. The backend should be deployed separately.

## Backend API Endpoints Expected

The frontend expects the following endpoints from your FastAPI backend:

### 1. POST /recognize
Recognizes faces in an uploaded image.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the image

**Response:**
```json
{
  "results": [
    {
      "name": "Student Name",
      "score": 1.12,
      "box": [x1, y1, x2, y2]
    }
  ]
}
```

### 2. POST /mark_attendance
Marks attendance for recognized students.

**Request:**
```json
{
  "date": "2025-02-10",
  "recognized_names": ["Student Name 1", "Student Name 2"]
}
```

**Response:** 200 OK on success

### 3. GET /attendance/all
Gets attendance summary for all students.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Student Name",
    "roll_no": "CS001",
    "present": 24,
    "total": 30,
    "percentage": 80.0
  }
]
```

### 4. GET /attendance/{student_id}
Gets attendance summary for a specific student.

**Response:**
```json
{
  "id": "uuid",
  "name": "Student Name",
  "roll_no": "CS001",
  "present": 24,
  "total": 30,
  "percentage": 80.0
}
```

## Configuration

1. **Enable Mock Data (Default)**
   - Edit `src/services/api.ts`
   - Set `USE_MOCK_DATA = true` (already configured)
   - Frontend works with mock data for testing UI

2. **Connect to Real Backend**
   - Deploy your FastAPI backend
   - Create `.env` file (see `.env.example`)
   - Set `VITE_API_BASE_URL` to your backend URL
   - Edit `src/services/api.ts`
   - Set `USE_MOCK_DATA = false`

## Database Schema

The PostgreSQL database is already set up via Lovable Cloud with these tables:

### students
- `id` (UUID, primary key)
- `name` (TEXT)
- `roll_no` (TEXT, unique)
- `created_at` (TIMESTAMP)

### class_sessions
- `id` (UUID, primary key)
- `date` (DATE)
- `created_at` (TIMESTAMP)

### attendance
- `id` (UUID, primary key)
- `student_id` (UUID, foreign key to students)
- `session_id` (UUID, foreign key to class_sessions)
- `status` (TEXT: 'present' or 'absent')
- `created_at` (TIMESTAMP)

## CORS Configuration

Your FastAPI backend must enable CORS to allow requests from this frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing the Integration

1. Start your FastAPI backend
2. Update `.env` with `VITE_API_BASE_URL`
3. Set `USE_MOCK_DATA = false` in `src/services/api.ts`
4. Upload a classroom image
5. Click "Recognize Faces"
6. Select date and click "Mark Attendance"

## Features Implemented

✅ Image upload with preview
✅ Face detection visualization with bounding boxes
✅ Attendance marking by date
✅ Student directory with search and sorting
✅ Individual student attendance reports
✅ Session history tracking
✅ Responsive mobile-friendly design
✅ Mock data mode for development
✅ Real-time attendance statistics

## Next Steps

1. Build and deploy your FastAPI backend following the structure you specified
2. Test each endpoint individually using tools like Postman
3. Update the frontend environment variables
4. Switch off mock mode
5. Test the full integration

For any issues or questions, refer to the API service implementation in `src/services/api.ts`.
