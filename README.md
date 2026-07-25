# Dollar Dreams Giveaway

A modern, full-stack giveaway and raffle management platform built with Express.js, MongoDB, and vanilla JavaScript.

## 🎯 Features

- **User Entry Management**: Simple form for users to enter the giveaway
- **Admin Dashboard**: Complete admin panel for managing entries and prizes
- **Prize Management**: Add, view, and manage prizes
- **Random Winner Selection**: Fairly select winners from eligible entries
- **Data Export**: Export all entries to CSV for record keeping
- **Authentication**: Secure admin login and registration
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern gradient design with smooth animations

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with modern features
- **Vanilla JavaScript** - No frameworks

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dollar-dreams-giveaway
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dollar-dreams
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
dollar-dreams-giveaway/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Entry.js
│   │   └── Prize.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── entries.js
│   │   ├── prizes.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── entry.html
│   ├── prize-list.html
│   ├── about.html
│   ├── contact.html
│   ├── admin/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   └── js/
│   │       └── admin.js
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       └── form-handler.js
└── package.json
```

## 🔐 Admin Features

- **Dashboard**: View key statistics
- **Entries Management**: See all entries with filtering
- **Prize Management**: Add and manage prizes
- **Winner Selection**: Randomly select winners
- **Data Export**: Export entries as CSV

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Login admin

### Entries
- `GET /api/entries` - Get all entries
- `POST /api/entries` - Submit new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### Prizes
- `GET /api/prizes` - Get all prizes
- `POST /api/prizes` - Create prize
- `PUT /api/prizes/:id` - Update prize
- `DELETE /api/prizes/:id` - Delete prize

### Admin
- `GET /api/admin/analytics` - Get analytics data
- `POST /api/admin/select-winner` - Select random winner
- `GET /api/admin/export/entries` - Export entries as CSV

## 🎨 Customization

### Colors
Edit CSS variables in `frontend/css/style.css`:
```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  --success-color: #10b981;
  --danger-color: #ef4444;
}
```

### Content
- Edit homepage content in `frontend/index.html`
- Modify prize descriptions in `frontend/prize-list.html`
- Update contact info in `frontend/contact.html`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please open an issue on GitHub or contact us at support@dollardreams.com

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern giveaway platforms
- Built with ❤️ for the community

---

**Made with ❤️ by Dollar Dreams Team**
