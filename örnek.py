# Get current project info
print(stack_auth_request('GET', '/api/v1/projects/current'))

# Get user info with access token
print(stack_auth_request('GET', '/api/v1/users/me', headers={
  'x-stack-access-token': access_token,
}))
