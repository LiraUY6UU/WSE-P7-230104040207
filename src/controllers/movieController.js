let movies = require('../data/movies');

// Helper function untuk mencari index
const findMovieIndex = (id) => {
  return movies.findIndex(movie => movie.id === parseInt(id));
};

// Helper function untuk generate ID baru
const generateId = () => {
  return movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
};

// GET semua movies
exports.getAllMovies = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: movies
  });
};

// GET movie by ID
exports.getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({
      status: 'fail',
      message: `Movie dengan id ${id} tidak ditemukan`
    });
  }

  res.status(200).json({
    status: 'success',
    data: movie
  });
};

// POST movie baru
exports.createMovie = (req, res) => {
  const { title, genre, year } = req.body;

  // Validasi field wajib
  if (!title) {
    return res.status(400).json({
      status: 'fail',
      message: "Field 'title' wajib diisi"
    });
  }

  if (!genre) {
    return res.status(400).json({
      status: 'fail',
      message: "Field 'genre' wajib diisi"
    });
  }

  if (!year) {
    return res.status(400).json({
      status: 'fail',
      message: "Field 'year' wajib diisi"
    });
  }

  // Validasi tambahan untuk year
  if (isNaN(year) || year < 1800 || year > new Date().getFullYear() + 5) {
    return res.status(400).json({
      status: 'fail',
      message: "Field 'year' harus berupa angka yang valid"
    });
  }

  const newMovie = {
    id: generateId(),
    title,
    genre,
    year: parseInt(year)
  };

  movies.push(newMovie);

  res.status(201).json({
    status: 'success',
    message: 'Movie berhasil ditambahkan',
    data: newMovie
  });
};

// PUT update movie
exports.updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const index = findMovieIndex(id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: `Movie dengan id ${id} tidak ditemukan`
    });
  }

  const { title, genre, year } = req.body;

  // Validasi field wajib
  if (!title) {
    return res.status(400).json({
      status: 'fail',
      message: "Field 'title' wajib diisi"
    });
  }

  if (!genre) {
    return res.status(400).json({
      status: 'fail',
      message: "Field 'genre' wajib diisi"
    });
  }

  if (!year) {
    return res.status(400).json({
      status: 'fail',
      message: "Field 'year' wajib diisi"
    });
  }

  // Validasi year
  if (isNaN(year) || year < 1800 || year > new Date().getFullYear() + 5) {
    return res.status(400).json({
      status: 'fail',
      message: "Field 'year' harus berupa angka yang valid"
    });
  }

  movies[index] = {
    id: id,
    title,
    genre,
    year: parseInt(year)
  };

  res.status(200).json({
    status: 'success',
    message: 'Movie berhasil diupdate',
    data: movies[index]
  });
};

// DELETE movie
exports.deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const index = findMovieIndex(id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: `Movie dengan id ${id} tidak ditemukan`
    });
  }

  movies.splice(index, 1);

  res.status(204).send();
};