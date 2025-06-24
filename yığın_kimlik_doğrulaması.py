import requests

def stack_auth_request(method, endpoint, **kwargs):
  res = requests.request(
    method,
    f'https://api.stack-auth.com/{endpoint}',
    headers={
      'x-stack-access-type': 'server',
      # You should store these in environment variables
      'x-stack-project-id': "9fc9392d-6573-41a7-a9f6-3d452b9ddfcf",
      'x-stack-publishable-client-key': "pck_gqr9qen9ayxfvkgd5dwpf043svz2rzeh7t122qtmx548r",
      'x-stack-secret-server-key': "ssk_65r02a7c7148pewggrps7vj0pjf5rh2xmpd8gzzjjt3pg",
      **kwargs.pop('headers', {}),
    },
    **kwargs,
  )
  if res.status_code >= 400:
    raise Exception(f"Stack Auth API request failed with {res.status_code}: {res.text}")
  return res.json()
