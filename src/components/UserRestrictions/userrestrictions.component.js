import React from 'react';

export default function UserRestrictions(props) {
  const { children, permittedUsers, roleId } = props;
  // const roleId = 1;
  const hasPermissions =
    (permittedUsers && permittedUsers.length && permittedUsers.includes(Number(roleId)) || permittedUsers.length<=0 || (permittedUsers.length>0 && !roleId));
  return <>{hasPermissions && <>{children}</>}</>;
}
