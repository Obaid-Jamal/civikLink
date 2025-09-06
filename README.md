CivicLink - Citizen Issue Reporting Platform
CivicLink is a web-based portal designed to bridge the gap between citizens and municipal authorities. It empowers users to report local civic issues, such as potholes, broken streetlights, or sanitation problems, directly to the concerned departments. The platform includes separate, feature-rich dashboards for both citizens and administrators to ensure transparent tracking and efficient resolution of reported problems.

The entire application runs on the front-end using HTML, CSS, and JavaScript, with all data managed through the browser's localStorage, making it a lightweight and serverless project.

✨ Key Features
For Citizens
User Authentication: Secure sign-up and login functionality for all users.

Report an Issue: An intuitive form to submit new issues with details like:

Category: Roads, Lighting, Water, Waste, or Public Safety.

Priority Level: From Low to Urgent.

Photo Uploads: Attach up to 5 images as visual evidence.

Voice Notes: Record a voice message directly in the browser instead of typing a description.

Geolocation: Automatically fetch and attach the user's current location.

Issue Tracking: A personal dashboard to view the status (Submitted, In Progress, Resolved) of all reported issues.

View Nearby Issues: A map-based view to see other issues reported in the vicinity.

Upvote System: Upvote existing issues to increase their visibility and priority.

Leaderboard: A gamified leaderboard that recognizes and ranks the most active and helpful citizens based on points.

Bilingual Support: Toggle between English and Hindi for better accessibility.

Notifications: Receive real-time notifications for status updates and resolutions.

For Administrators
Role-Based Dashboard: A dedicated dashboard for departmental admins and a main admin.

Issue Management: View, filter (by status or category), and manage all issues assigned to their department.

Update Status: Mark issues as "In Progress" or "Resolved".

Official Replies: Add official comments and attach proof-of-fix images to resolved issues.

Interactive Map View: Visualize the geographic distribution of all reported issues on a map using Leaflet.js.

Analytics Dashboard: View statistics and charts (using Chart.js) on the volume and types of issues reported.

User Management: View a list of all registered users. The main admin has privileges to delete users.

Automatic Priority Escalation: Issues are automatically upgraded to higher priority levels based on the number of community upvotes.

Smart Features
Duplicate Issue Detection: The system automatically checks for similar open issues in the same location and category, preventing duplicate reports and consolidating feedback by converting the new report into an upvote.

Persistent Language Preference: The user's selected language is saved locally, ensuring a consistent experience across all pages without needing to toggle it again.

🛠️ Tech Stack
Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)

Libraries:

Font Awesome for icons.

Chart.js for data visualization and analytics.

Leaflet.js for the interactive map.

Data Storage: Browser localStorage is used to simulate a database, making the project fully client-side and serverless.

🚀 Getting Started
This project is fully static and requires no build steps or complex setup.

Prerequisites
A modern web browser (like Chrome, Firefox, or Safari).

A code editor (like VS Code).

Installation
Clone the repository to your local machine:

git clone [https://github.com/your-username/civiclink.git](https://github.com/your-username/civiclink.git)

Navigate into the project directory:

cd civiclink

Open the index.html file directly in your web browser. For the best experience (especially for features like geolocation and voice recording), it's recommended to serve the files using a simple local server. If you have VS Code, the "Live Server" extension is an excellent option.

☁️ Deployment
This project can be deployed for free on any static hosting provider.

Push your project code to a new repository on GitHub.

Sign up for a service like Vercel, Netlify, or GitHub Pages.

Connect your GitHub repository to the hosting service.

Configure the project settings:

Framework Preset: Other

Build Command: (leave empty)

Output Directory: (leave empty)

Deploy! Your CivicLink portal will be live on the web.

🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the issues page if you want to contribute.

📜 License
This project is licensed under the MIT License. See the LICENSE file for details.