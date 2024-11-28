import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CContainer, CSpinner } from '@coreui/react';
import appContentStyle from './appContent.style.module.scss';

// routes config
import routes from '../routes';
console.log(appContentStyle);
const AppContent = () => {
  return (
    <div className={appContentStyle.mianRootContainer}>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={route.element}
                />
              )
            );
          })}
          {/*<Route path="/" element={<Navigate to="login" replace />} />*/}
        </Routes>
      </Suspense>
    </div>
  );
};

export default React.memo(AppContent);
