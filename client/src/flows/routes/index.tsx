import React, { Suspense } from 'react';
import { CircularProgress, CssBaseline } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthenticatedRoute } from '../../components/generic/AuthenticatedRoute';

import MainPage from '../main';
import TopicPage from '../topic';
import NotFoundPage from '../notFound';

export const AppRoutes: React.FC = function () {
  return (
    <Suspense fallback={() => <CircularProgress color="success" />}>
      <CssBaseline />
      <Routes>
        <Route
          // @ts-ignore
          index
          path="/"
          element={<Navigate to={'/main'} />}
        />

        <Route element={<AuthenticatedRoute unauthenticated />}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/topic" element={<TopicPage />} />

          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
