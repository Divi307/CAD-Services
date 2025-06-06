const express = require('express');
const multer = require('multer');
const path = require('path');
const basicAuth = require('basic-auth');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

const adminUser = 'CADservices1984';
const adminPass = 'ManojPatidarCADs';

function auth(req, res, next) {
  const user = basicAuth(req);
  if (!user || user.name !== adminUser || user.pass !== adminPass) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required.');
  }
  next();
}

app.get('/admin.html', auth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));




// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'divijpatidar@gmail.com',         // Admin email
    pass: 'eplh hbto zqfz jjqm'        // Gmail App Password
  }
});

// Helper: Generate index.html with posts
function generatePostsHTML(posts) {
  const sortedPosts = posts.slice().sort((a, b) => {
    const parseDate = str => {
      const [day, month, year] = str.split('/');
      return new Date(`20${year}`, month - 1, day); // convert to full year
    };
    return parseDate(b.date) - parseDate(a.date); // descending
  });

  const postCards = sortedPosts.map(post => `
    <div class="post" style="background-image: url('${post.bgImage}');">
      <h2>${post.title}</h2>
      <div class="date">${post.date}</div>
    </div>
  `).join('\n');

  const slideItems = posts.map((post, index) => `
    <div class="slide ${index === 0 ? 'active' : ''}" style="background-image: url('${post.bgImage}');">
      <div class="slide-content">
        <h2>${post.title}</h2>
        <div class="date">${post.date}</div>
      </div>
    </div>
  `).join('\n');

  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/styles.css">
      <link rel="icon" type="image/x-icon" href="/photos/logo.jpeg">
      <title>Cad Services | Home</title>
    </head>
    <body>
    <nav class="navbar">
        <div class="nav-logo">
            <a href="index.html"><img src="/photos/cad-services.jpeg" alt="Cad Services Logo"></a>
        </div>
        <div class="nav-links" id="navLinks">
            <a href="index.html" class="navlink">Home</a>
            <a href="services.html" class="navlink">Services</a>
            <a href="contact.html" class="navlink">Contact</a>
        </div>
        <div class="hamburger" id="hamburger">&#9776;</div>
    </nav>
    <script>
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent click from bubbling
    navLinks.classList.toggle('show');
  });

  // Prevent clicks inside the menu from closing it
  navLinks.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close menu if clicked anywhere else
  document.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
</script><br><br><br><hr><br>
      <div class="slideshow-container">
      ${slideItems}
      <button class="slide-btn prev">🡠</button>
      <button class="slide-btn next">🡢</button>
    </div><br><hr><br>
      <div class="post-container">
      <h1 style="display:flex;justify-content:center;">Our Projects</h1><br><hr>
      <div class="posts-container">
        ${postCards}
      </div>
      </div><hr><br>

     <script>
      let currentSlide = 0;
      const slides = document.querySelectorAll('.slide');
      const totalSlides = slides.length;

      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.classList.remove('active');
          if (i === index) slide.classList.add('active');
        });
      }

      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
      }

      function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
      }

      document.querySelector('.next').addEventListener('click', nextSlide);
      document.querySelector('.prev').addEventListener('click', prevSlide);

      // Auto slide
      setInterval(nextSlide, 4000);
    </script>
    </body>
    <footer>
    <div class="footer"><div class="footer-logo">
      <img src="/photos/cad-services.jpeg" alt="Cad Services Logo">
      </div>
      <div class="footerinfoandlinks">
      <div class="footer-info">
      <hr style="margin-bottom:5px;">
      <h3>At CAD Services, we combine advanced technologies with industry experience to deliver results that meet the highest standards of 
        quality and efficiency. Whether it's topographic surveys, land development planning, contour mapping, or CAD drafting, our team is 
        dedicated to turning complex data into clear, actionable insights.</h3>
      </div>
      <div class="footer-links">
        <hr style="margin-bottom:5px;">
        <h3>SERVICES</h3><br>
        <h3>Bridge Survey</h3>
        <h3>Land Survey</h3>
        <h3>Road Survey</h3>
        <h3>Survey by Total Station</h3>
        <h3>Survey by DGPS</h3>
        <h3>Layout Work</h3>
        <h3>Center Line Marking</h3>
        <h3>Training Program</h3><br><br><br>
        <hr style="margin-bottom:5px;">
        <div class="social-links">
        <a href="https://www.facebook.com/p/CAD-Services-100066734150274/" target="_blank"><img src="/photos/fb.png" alt="Facebook" width="25px" height="25px"></a>
        <a href="https://www.instagram.com/cad.services_indore/" target="_blank"><img src="/photos/ig.png" alt="Instagram" width="25px" height="25px"></a>
        <h6 style="margin-top:2%;">&copy; 2025 by CAD Services</h6>  
      </div>
    </div>
    <div class="footer-address">
      <hr style="margin-bottom:5px;">
      <h3>LOCATED AT</h3><br>
      <h3>205, Gold Arcade, 3/1, Janjeerwala Square,<br> Opp. Vrindavan restourant, New Palasia, Indore,<br>Madhya Pradesh 452001</h3>
    </div>
    </div>
  </footer>
    </html>
  `;
}



// GET all posts (JSON)
app.get('/get-posts', (req, res) => {
  const postsFile = path.join(__dirname, 'data', 'index.json');

  let posts = [];
  if (fs.existsSync(postsFile)) {
    const raw = fs.readFileSync(postsFile, 'utf8');
    posts = raw ? JSON.parse(raw) : [];
  }
  res.json(posts);
});

app.post('/send-email', (req, res) => {
  const { fullName, email, phone, message } = req.body;

  const mailOptions = {
    from: `"${fullName}" <${email}>`,
    to: 'divijpatidar@gmail.com',    // Admin ka email
    subject: 'You have a new message from your website contact form',
    text: `
New Message from:

Name: ${fullName}
Email: ${email}
Phone: ${phone}

Message:
${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send email.');
    }
    console.log('Email sent:', info.response);
    res.redirect('/index.html');
  });
});

// POST add a post (image + title + date)
app.post('/add-post', upload.single('bgImage'), (req, res) => {
  if (!req.file) return res.status(400).send('Image upload failed.');

  const { title, date } = req.body;

  // Format date dd/mm/yy
  let formattedDate = date;
  try {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    formattedDate = `${day}/${month}/${year}`;
  } catch (err) {
    console.error('Invalid date format:', date);
  }

  const imagePath = 'uploads/' + req.file.filename;
  const postsFile = path.join(__dirname, 'data', 'index.json');

  const newPost = {
    id: uuidv4(),
    title,
    date: formattedDate,
    bgImage: imagePath
  };

  let posts = [];
  if (fs.existsSync(postsFile)) {
    const rawData = fs.readFileSync(postsFile, 'utf8').trim();
    posts = rawData ? JSON.parse(rawData) : [];
  }

  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

  // Regenerate index.html
  const postsHTML = generatePostsHTML(posts);
  fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), postsHTML);

  res.redirect('/admin.html');
});

// POST edit post by id
app.post('/edit-post', (req, res) => {
  const { id, title, date } = req.body;
  const postsFile = path.join(__dirname, 'data', 'index.json');

  let posts = JSON.parse(fs.readFileSync(postsFile));

  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });

  posts[postIndex].title = title;
  posts[postIndex].date = date;

  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

  // ✅ Regenerate index.html after edit
  const updatedHTML = generatePostsHTML(posts);
  fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), updatedHTML);

  res.json({ message: 'Post updated successfully' });
});

// DELETE delete post by id
app.delete('/delete-post/:id', (req, res) => {
  const id = req.params.id;
  const postsFile = path.join(__dirname, 'data', 'index.json');

  if (!fs.existsSync(postsFile)) {
    return res.status(404).json({ success: false, message: 'Posts file not found' });
  }

  let posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));

  const newPosts = posts.filter(post => post.id !== id);

  if (newPosts.length === posts.length) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // ✅ Save updated JSON
  fs.writeFileSync(postsFile, JSON.stringify(newPosts, null, 2));

  // ✅ Regenerate index.html
  const updatedHTML = generatePostsHTML(newPosts);
  fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), updatedHTML);

  res.json({ success: true, message: 'Post deleted and HTML updated successfully' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
