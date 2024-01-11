import React from "react";
import {
  createMemoryRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import AddMessage from "./components/add-message.component";
import AddTorrent from "./components/add-torrent.component";
import Message from "./components/message.component";
import MessagesList from "./components/messages-list.component";

import Navigation from "./Navigation";

const Root = () => (
  <div>
    <Navigation />
    <div>
      <Outlet />
    </div>
  </div>
);

const Welcome = () => (
  <div>
    Welcome to the very first #Net agent&apos;s admin panel. Keep in mind - it&apos;s still under construction.
  </div>
);

const router = createMemoryRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/welcome",
        element: <Welcome />,
        index: true,
      },
      {
        path: "/messages",
        element: <MessagesList />,
      },
      {
        path: "/add",
        element: <AddMessage />,
      },
      {
        path: "/add-torrent",
        element: <AddTorrent />,
      },
      {
        path: "/message/:id",
        element: <Message />,
      },
    ],
  },
]);

const App = () => (
  <RouterProvider router={router} />
);

export default App;
