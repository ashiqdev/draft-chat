import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import ChatroomPage from './pages/ChatroomPage';
import DashboardPage from './pages/DashboardPage';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Messages from './pages/Messages';
import RegisterPage from './pages/RegisterPage';
import makeToast from './Toaster';

function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem('CC_Token');
    if (token && token.length > 0 && !socket) {
      const newSocket = io('http://localhost:8000', {
        query: {
          token: localStorage.getItem('CC_Token'),
        },
      });

      newSocket.on('disconnect', () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast('error', 'Socket disconnected!');
      });

      newSocket.on('connect', () => {
        makeToast('success', 'Socket Connected');
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={IndexPage} />
        <Route
          exact
          path='/login'
          render={() => <LoginPage setupSocket={setupSocket} />}
        />
        <Route exact path='/register' component={RegisterPage} />
        <Route
          exact
          path='/dashboard'
          render={() => <DashboardPage socket={socket} />}
        />
        <Route
          exact
          path='/chatroom/:id'
          render={() => <ChatroomPage socket={socket} />}
        />

      </Switch>
    </Router>
  );
}

export default App;
