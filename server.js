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

function generatePostPage(post) {
  const { id, title, description, bgImage } = post;
  const filename = `post-${id}.html`;
  const postsDir = path.join(__dirname, 'public', 'posts');
  const filePath = path.join(postsDir, filename);
  // Create posts directory if it doesn't exist
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-site-verification" content="dp8sEivN8W0IZXp0uYhnIUyZfxPSifXgayLRmGHOw9c" />
    <meta name="author" content="CAD Services | ${title}">
    <meta name="description" content="${description}">
    <meta property="image" content="${bgImage}" />
    <meta property="og:url" content="https://www.cadservices.in/posts/post-${post.id}.html" />
    <meta name="keywords" content="CAD services, land surveyor, land surveyor in indore, Indore survey, civil engineering, civil engineering in indore, topographic survey, topographic survey in indore, construction mapping, contour mapping in indore, layout work in indore, center line marking in indore, DGPS survey in indore, total station survey in indore, training program in indore, bridge survey in indore, road survey in indore, land development planning in indore, cad drafting in indore, cad services in indore, cad services near me, cad services for builders, cad services for architects, cad services for civil engineers">
    <meta name="robots" content="index, follow">
   <!-- whatsapp,fb card -->
    <meta property="og:title" content="CAD Services | ${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${bgImage}">
    <meta property="og:url" content="https://www.cadservices.in/posts/post-${post.id}.html">
    <meta property="og:type" content="website">
   <!-- Twitter Card -->
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="CAD Services | ${title}">
   <meta name="twitter:description" content="${description}">
   <meta name="twitter:image" content="${bgImage}">
    <link rel="stylesheet" href="/styles.css">
    <link rel="icon" type="image/x-icon" href="/photos/logo.png">
    <title>CAD Services | Projects | ${title}</title>
    <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Business",
    "name": "CAD Services",
    "description": "CAD and land surveying services in Indore since 2000.",
    "url": "https://www.cadservices.in",
    "logo": "https://www.cadservices.in/photos/logo.png",
    "telephone": "+91-9826773808",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "205, Gold Arcade, 3/1, Janjeerwala Square, New Palasia",
      "addressLocality": "Indore",
      "addressRegion": "MP",
      "postalCode": "452001",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Sa 09:00-18:00",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.727000,
      "longitude": 75.881833
    }
  }
  </script>

    <nav class="navbar">
        <div class="nav-logo">
            <a href="/index.html"><img src="/photos/logo.jpeg" alt="Cad Services Logo" width="30px" height="40px"></a>
            <a href="/index.html"><img src="/photos/cad-services.png" alt="Cad Services Logo" width="220px" height="40px"></a>
        </div>
        <div class="nav-links" id="navLinks">
            <a href="/index.html" class="navlink">Home</a>
            <a href="/services.html" class="navlink">Services</a>
            <a href="/contact.html" class="navlink">Contact</a>
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
</script>
  </head>
  <body>
  <br><br><br><hr><br>
    <h1 class="newHTMLtitle">${title}</h1>
    <br><hr><br>
    <img src="/${bgImage}" alt="${title}" class="newHTMLimg" /><br><hr><br>
    <h3 class="newHTMLdesc">${description}</h3><br><hr><br>
    <a href="/index.html" class="newHTMLhomelink"><h3>Back to Home</h3></a><br><hr><br>
  </body>
  <footer>
    <div class="footer"><div class="footer-logo">
      <img src="/photos/cad-services.png" alt="Cad Services Logo" width="220px" height="40px">
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
      <nav>
        <h3>SERVICES</h3><br>
        <h3> • Bridge Survey</h3>
        <h3> • Land Survey</h3>
        <h3> • Road Survey</h3>
        <h3> • Survey by Total Station</h3>
        <h3> • Survey by DGPS</h3>
        <h3> • Layout Work</h3>
        <h3> • Center Line Marking</h3>
        <h3> • Training Program</h3>
      </nav><br><br><br>
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
      <h3>205, Gold Arcade, 3/1, Janjeerwala Square, New Palasia, Indore, Madhya Pradesh (452001)</h3><br><br><hr style="margin-bottom:5px;">
      <h3>CONTACT US</h3><br>
      <h3>+91 9826773808,<br>+91 9425073808</h3>
      <h6>cadservices2000@gmail.com</h6>
    </div>
    </div>
  </footer>
  </html>`;

  fs.writeFileSync(filePath, htmlContent);
}

function generatePostsHTML(posts) {
  const sortedPosts = posts.slice().sort((a, b) => {
    const parseDate = str => {
      const [day, month, year] = str.split('/');
      return new Date(`20${year}`, month - 1, day);
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  const postCards = sortedPosts.map(post => `
    <a href="posts/post-${post.id}.html" style="text-decoration:none;">
    <div class="post" style="background-image: url('${post.bgImage}');">
      <h2>${post.title}</h2>
      <div class="date">${post.date}</div>  
    </div>
    </a>
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

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-site-verification" content="dp8sEivN8W0IZXp0uYhnIUyZfxPSifXgayLRmGHOw9c" />
    <meta name="author" content="CAD Services">
    <meta name="description" content="Professional CAD and land surveying services in Indore since 2000. Trusted by top builders and architects for contour mapping, layout work, and accurate site planning.">
    <meta property="image" content="https://www.cadservices.in/photos/logo.png" />
    <meta property="og:url" content="https://www.cadservices.in/" />
    <meta name="keywords" content="CAD services, land surveyor, land surveyor in indore, Indore survey, civil engineering, civil engineering in indore, topographic survey, topographic survey in indore, construction mapping, contour mapping in indore, layout work in indore, center line marking in indore, DGPS survey in indore, total station survey in indore, training program in indore, bridge survey in indore, road survey in indore, land development planning in indore, cad drafting in indore, cad services in indore, cad services near me, cad services for builders, cad services for architects, cad services for civil engineers">
    <meta name="robots" content="index, follow">
   <!-- whatsapp,fb card -->
    <meta property="og:title" content="CAD Services">
    <meta property="og:description" content="Professional CAD and land surveying services in Indore since 2000. Trusted by top builders and architects for contour mapping, layout work, and accurate site planning.">
    <meta property="og:image" content="https://www.cadservices.in/photos/logo.png">
    <meta property="og:url" content="https://www.cadservices.in/">
    <meta property="og:type" content="website">
   <!-- Twitter Card -->
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="CAD Services">
   <meta name="twitter:description" content="Professional CAD and land surveying services in Indore since 2000. Trusted by top builders and architects for contour mapping, layout work, and accurate site planning.">
   <meta name="twitter:image" content="https://cadservices.in/photos/logo.png">
    <link rel="stylesheet" href="/styles.css">
    <link rel="icon" type="image/x-icon" href="/photos/logo.png">
    <title>Cad Services | Home</title>
    <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Business",
    "name": "CAD Services",
    "description": "CAD and land surveying services in Indore since 2000.",
    "url": "https://www.cadservices.in",
    "logo": "https://www.cadservices.in/photos/logo.png",
    "telephone": "+91-9826773808",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "205, Gold Arcade, 3/1, Janjeerwala Square, New Palasia",
      "addressLocality": "Indore",
      "addressRegion": "MP",
      "postalCode": "452001",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Sa 09:00-18:00",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.727000,
      "longitude": 75.881833
    }
  }
  </script>

    </head>
    <body>
    <nav class="navbar">
        <div class="nav-logo">
            <a href="index.html"><img src="/photos/logo.jpeg" alt="Cad Services Logo" width="30px" height="40px"></a>
            <a href="index.html"><img src="/photos/cad-services.png" alt="Cad Services Logo" width="220px" height="40px"></a>
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
      <img src="/photos/cad-services.png" alt="Cad Services Logo" width="220px" height="40px">
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
      <nav>
        <h3>SERVICES</h3><br>
        <h3> • Bridge Survey</h3>
        <h3> • Land Survey</h3>
        <h3> • Road Survey</h3>
        <h3> • Survey by Total Station</h3>
        <h3> • Survey by DGPS</h3>
        <h3> • Layout Work</h3>
        <h3> • Center Line Marking</h3>
        <h3> • Training Program</h3>
      </nav><br><br><br>
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
      <h3>205, Gold Arcade, 3/1, Janjeerwala Square, New Palasia, Indore, Madhya Pradesh (452001)</h3><br><br><hr style="margin-bottom:5px;">
      <h3>CONTACT US</h3><br>
      <h3>+91 9826773808,<br>+91 9425073808</h3>
      <h6>cadservices2000@gmail.com</h6>
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

app.get('/download-index', (req, res) => {
  const filePathdata = path.join(__dirname, 'data', 'index.json');

  if (fs.existsSync(filePathdata)) {
    res.download(filePathdata, 'index.json', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Could not download the file.');
      }
    });
  } else {
    res.status(404).send('index.json file not found.');
  }
});

app.post('/send-email', (req, res) => {
  const { fullName, email, phone, message } = req.body;

  const mailOptions = {
    from: `"${fullName}" <${email}>`,
    to: 'divijpatidar.com',    // Admin's email
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

// POST add a post (image + title + date + description)
app.post('/add-post', upload.single('bgImage'), (req, res) => {
  if (!req.file) return res.status(400).send('Image upload failed.');

  const { title, date, description } = req.body;

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
    bgImage: imagePath,
    description: description || ''  // Add description here
  };

  let posts = [];
  if (fs.existsSync(postsFile)) {
    const rawData = fs.readFileSync(postsFile, 'utf8').trim();
    posts = rawData ? JSON.parse(rawData) : [];
  }

  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

  // Regenerating index.html
  generatePostPage(newPost);  
  const postsHTML = generatePostsHTML(posts);
  fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), postsHTML);

  res.redirect('/admin.html');
});

// POST edit post by id (title, date, description)
app.post('/edit-post', (req, res) => {
  const { id, title, date, description } = req.body;
  const postsFile = path.join(__dirname, 'data', 'index.json');

  let posts = JSON.parse(fs.readFileSync(postsFile));

  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Update the post
  posts[postIndex].title = title;
  posts[postIndex].date = date;
  posts[postIndex].description = description || '';

  // Save updated post data
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

  // Regeneratingg post HTML
  generatePostPage(posts[postIndex]);

  // Regenerating index.html
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
  const postToDelete = posts.find(post => post.id === id);

  if (!postToDelete) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // Delete the uploaded image
  const imagePath = path.join(__dirname, 'public', postToDelete.bgImage);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  // Delete the individual HTML page
  const postPagePath = path.join(__dirname, 'public', 'posts', `post-${id}.html`);
  if (fs.existsSync(postPagePath)) {
    fs.unlinkSync(postPagePath);
  }

  // Filter out the deleted post and update JSON
  const newPosts = posts.filter(post => post.id !== id);
  fs.writeFileSync(postsFile, JSON.stringify(newPosts, null, 2));

  // Regenerate homepage
  const updatedHTML = generatePostsHTML(newPosts);
  fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), updatedHTML);

  res.json({ success: true, message: 'Post, image, and HTML page deleted successfully' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
