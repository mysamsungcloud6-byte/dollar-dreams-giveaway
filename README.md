# Dollar Dreams Giveaway

A promotional giveaway website showcasing prizes (cash, cars, vacations, and dream rewards) with a secure admin dashboard for full control.

## 🎯 Features

### Public Website
- **Home Page**: Hero section with giveaway overview and featured prizes
- **Prize List Page**: Showcase of all prize categories with images
- **Entry Form**: User-friendly form to enter the giveaway
- **About Page**: Mission statement and transparency information
- **Contact Page**: Contact form and social media links
- **Mobile Responsive Design**: Works seamlessly on all devices

### Admin Dashboard
- **Secure Login**: Email + password authentication
- **Entry Management**: View all giveaway entries (name, email, phone, timestamp)
- **Prize Management**: Add, edit, delete prizes with image uploads
- **Content Management**: Edit homepage, prize descriptions, and images
- **Winner Selection**: Random winner generator with export functionality
- **Analytics**: Track entry count and basic traffic overview

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Multer (local) or cloud storage (AWS S3 optional)
- **Environment**: Dotenv for configuration

## 📁 Project Structure

```
dollar-dreams-giveaway/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Prize.js
│   │   └── Entry.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── prizes.js
│   │   ├── entries.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── uploads/
│   │   └── (prize images)
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── prize-list.html
│   ├── entry.html
│   ├── about.html
│   ├── contact.html
│   ├── admin/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── manage-prizes.html
│   │   └── admin.js
│   ├── css/
│   │   ├── style.css
│   │   └── admin-style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── form-handler.js
│   │   └── admin-auth.js
│   └── images/
│       ├── cash.jpg
│       ├── cars.jpg
│       ├── vacation.jpg
│       └── dream-rewards.jpg
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mysamsungcloud6-byte/dollar-dreams-giveaway.git
cd dollar-dreams-giveaway
```

2. **Backend setup**
```bash
cd backend
npm install
```

3. **Configure environment variables**
```bash
# Create .env file in backend/
echo "MONGODB_URI=mongodb://localhost:27017/dollar-dreams" > .env
echo "JWT_SECRET=your-secret-key-here" >> .env
echo "PORT=5000" >> .env
echo "ADMIN_EMAIL=admin@example.com" >> .env
echo "ADMIN_PASSWORD=admin123" >> .env
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Start the backend server**
```bash
npm start
# Server runs on http://localhost:5000
```

6. **Open frontend**
- Open `frontend/index.html` in your browser
- Or serve with a local server:
```bash
cd ../frontend
python -m http.server 8000
# Open http://localhost:8000
```

## 🔐 Admin Access

**Default Admin Credentials** (change immediately in production)
- Email: `admin@example.com`
- Password: `admin123`

Access admin dashboard at: `http://localhost:8000/admin/login.html`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Prizes
- `GET /api/prizes` - Get all prizes
- `POST /api/prizes` - Create new prize (admin only)
- `PUT /api/prizes/:id` - Update prize (admin only)
- `DELETE /api/prizes/:id` - Delete prize (admin only)

### Entries
- `POST /api/entries` - Submit giveaway entry
- `GET /api/entries` - Get all entries (admin only)
- `DELETE /api/entries/:id` - Delete entry (admin only)

### Winner Selection
- `POST /api/admin/select-winner` - Randomly select winner (admin only)
- `GET /api/admin/analytics` - Get giveaway analytics (admin only)

## 🎨 Customization

### Update Prize Categories
Edit `backend/models/Prize.js` to modify prize types:
```javascript
// Modify the category enum
category: {
  type: String,
  enum: ['Cash', 'Cars', 'Vacations', 'Dream Rewards', 'Your-Category'],
  required: true
}
```

### Customize Branding
- Update logo in `frontend/index.html`
- Modify colors in `frontend/css/style.css`
- Edit copy in all HTML files

## 📦 Deployment

### Deploy Backend to Heroku
```bash
cd backend
heroku login
heroku create dollar-dreams-giveaway
git push heroku main
```

### Deploy Frontend to Vercel
```bash
cd frontend
npm install -g vercel
vercel
```

## 🔒 Security Considerations

- Change default admin credentials immediately
- Use strong JWT_SECRET in production
- Enable HTTPS on production
- Sanitize all user inputs
- Use environment variables for sensitive data
- Implement rate limiting on entry endpoint
- Add CSRF protection
- Validate file uploads

## 📧 Support

For questions or issues, contact: support@dollardreams.com

## 📄 License

MIT License - feel free to use this project as needed.

---

**Built with ❤️ for your giveaway success!**