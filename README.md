<h1 style="text-align: center;">chat_jwt</h1>
<h3 style="text-align: center;">Real-time chat app with JWT authentication, private messaging, and group communication</h3>

<p><strong>Developed on Windows by Woodley T.K.</strong></p>

<h2>🧪 Installation & Setup</h2>

<h3>📁 Clone the Repository</h3>
<pre><code>git clone [REPOSITORY_URL]</code></pre>

<h3>📦 Install Dependencies</h3>

<h4>Frontend (React):</h4>
<pre><code>
cd client
npm install
</code></pre>

<h4>Backend (Node.js):</h4>
<pre><code>
cd server
npm install
</code></pre>

<h3>⚙️ Environment Variables</h3>

<h4><code>.env</code> in the client:</h4>
<pre><code>
VITE_SERVER_URL=http://localhost:5000
</code></pre>

<h4><code>.env</code> in the server:</h4>
<pre><code>
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
</code></pre>

<h3>🚀 Run the Servers</h3>

<h4>Frontend:</h4>
<pre><code>npm run dev</code></pre>

<h4>Backend:</h4>
<pre><code>node index.js</code></pre>

<hr>

<h2>🛠 Technologies Used</h2>

<h3>Frontend</h3>
<ul>
  <li>React</li>
  <li>Axios</li>
  <li>React Router DOM</li>
  <li>Socket.IO Client</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js & Express</li>
  <li>bcrypt</li>
  <li>cookie-parser</li>
  <li>cors</li>
  <li>dotenv</li>
  <li>jsonwebtoken</li>
  <li>mysql2</li>
  <li>Socket.IO</li>
</ul>

<hr>

<h2>🧩 App Structure & Features</h2>

<ol>
  <li><strong>Account Access:</strong> Users must register to access all features. If already registered, they can simply log in.</li>

  <li><strong>Token Creation on Login:</strong> On login, an <code>accessToken</code> and a <code>refreshToken</code> are created. The accessToken is sent to the client, while the refreshToken is stored as an HTTP-only cookie. Both tokens include the user ID.</li>

  <li><strong>Token Management:</strong> The client uses a token service file that manages:
    <ul>
      <li><code>getToken</code> – retrieves the accessToken</li>
      <li><code>setToken</code> – saves/updates the accessToken</li>
      <li><code>removeToken</code> – clears the accessToken</li>
    </ul>
  </li>

  <li><strong>Axios Middleware:</strong> Intercepts responses to automatically store tokens in the service file and redirects the user to the main page <code>'/'</code>.</li>

  <li><strong>Token Verification on Page Load:</strong> The main page uses <code>useEffect</code> to make a request to the backend before rendering, validating the accessToken.</li>

  <li><strong>Backend Token Middleware:</strong>
    <ul>
      <li>If no accessToken is provided, access is denied.</li>
      <li>If the accessToken is expired but a valid refreshToken exists:
        <ul>
          <li>New accessToken and refreshToken are generated.</li>
          <li>New tokens are sent in headers and cookies.</li>
          <li>User ID is extracted and attached to the request.</li>
        </ul>
      </li>
      <li>If the accessToken is valid, access is granted.</li>
      <li>If the token is invalid or missing, access is denied.</li>
    </ul>
  </li>

  <li><strong>Messaging:</strong> To send messages (private or group), the user's accessToken must be verified.</li>

  <li><strong>Group Chats:</strong>
    <ul>
      <li>Users can create or join groups.</li>
      <li>Once inside a group, users can chat with all members.</li>
      <li>Users can leave groups at any time.</li>
    </ul>
  </li>

  <li><strong>Persistent Messages:</strong> All messages are stored in a MySQL database and are not deleted.</li>
</ol>

<hr>

<h2>📌 Notes</h2>
<ul>
  <li>The frontend does not have advanced UI/UX styling, as the developer focuses on backend and logic implementation.</li>
  <li>All token handling is done securely via HTTP-only cookies and in-memory accessToken management.</li>
  <li>Refresh token rotation is implemented for improved security.</li>
</ul>
