<h1 style="text-align: center;">chat_jwt</h1>
<h3 style="text-align: center;">Real-time chat app with JWT authentication and group support</h3>

<p><strong>Developed on Windows by Woodley T.K.</strong></p>

<h2>🔧 Technologies Used</h2>
<h3>Frontend (React):</h3>
<ul>
  <li>React</li>
  <li>Axios</li>
  <li>react-router-dom</li>
  <li>socket.io-client</li>
</ul>

<h3>Backend (Node.js / Express):</h3>
<ul>
  <li>express</li>
  <li>bcrypt</li>
  <li>cookie-parser</li>
  <li>cors</li>
  <li>dotenv</li>
  <li>jsonwebtoken</li>
  <li>mysql2</li>
  <li>socket.io</li>
</ul>

<h2>⚙️ Environment Configuration</h2>
<h3>Frontend (.env)</h3>
<ul>
  <li><code>VITE_SERVER_URL</code> => Backend URL</li>
</ul>

<h3>Backend (.env)</h3>
<ul>
  <li><code>CLIENT_URL</code> => Frontend URL</li>
  <li><code>PORT</code> => Backend port</li>
  <li><code>JWT_ACCESS_SECRET</code> => Secret key for accessToken</li>
  <li><code>JWT_REFRESH_SECRET</code> => Secret key for refreshToken</li>
</ul>

<h2>🧩 App Composition</h2>
<ol>
  <li>Users must register to access all features. If they already have an account, they can just log in.</li>
  <li>After login, an <code>accessToken</code> and a <code>refreshToken</code> are created. The accessToken is sent to the client, and the refreshToken is stored as an httpOnly cookie.</li>
  <li>The client manages the token using a <strong>service</strong> file with:
    <ul>
      <li><code>getToken</code>: returns the accessToken</li>
      <li><code>setToken</code>: stores or updates the token</li>
      <li><code>removeToken</code>: clears the token (sets it to null)</li>
    </ul>
  </li>
  <li>An Axios interceptor automatically stores the token with <code>setToken</code> and redirects to <code>'/'</code>.</li>
  <li>On the home page, a <code>useEffect</code> checks the token before rendering the page.</li>
  <li>On the backend, a middleware checks if the token exists:
    <ul>
      <li>If the accessToken is expired, it generates a new access and refresh token, and returns them to the client.</li>
      <li>If the token is valid, access is granted.</li>
      <li>If invalid, access is denied.</li>
    </ul>
  </li>
  <li>To send messages to users or groups, the token must be valid.</li>
  <li>To chat in groups, you must either create or join a group first.</li>
</ol>

<h2>💬 Extras</h2>
<ul>
  <li>Messages are persistent and stored in the database.</li>
  <li>Users can leave groups at any time.</li>
</ul>
