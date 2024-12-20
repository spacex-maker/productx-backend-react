import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CSpinner } from '@coreui/react';

import routes from '../../routes';
import appContentStyle from './index.module.scss';

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
