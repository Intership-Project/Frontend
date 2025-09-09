const SERVER_URL = 'http://localhost:4000'; // backend URL

export function createUrl(path) {
  // normalize path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SERVER_URL}/${cleanPath}`;
}

export function createError(error) {
<<<<<<< Updated upstream
    return { status : 'error', error }

}
=======
  return { status: 'error', error };
}

export function createSuccess(data) {
  return { status: 'success', data };
}
>>>>>>> Stashed changes
