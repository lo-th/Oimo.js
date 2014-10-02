var IK = IK || {};

/*** Vector calculations. ***/

// Vector add.
IK.vadd = function(v1, v2) {

	var length = v1.length;

	var v = new Array(length);

	for (var i = 0; i < length; ++i) {
		v[i] = v1[i] + v2[i];
	}

	return v;
};

// Vector sub.
IK.vsub = function(v1, v2) {

	var length = v1.length;

	var v = new Array(length);

	for (var i = 0; i < length; ++i) {
		v[i] = v1[i] - v2[i];
	}

	return v;
};

// Vector dot product.
IK.vdot = function(v1, v2) {

	var length = v1.length;

	var v = 0;

	for (var i = 0; i < length; ++i) {
		v += v1[i] * v2[i];
	}

	return v;
};

// 3-D vector cross product.
IK.v3cross = function(v1, v2) {

	var x = v1[1] * v2[2] - v1[2] * v2[1];
	var y = v1[2] * v2[0] - v1[0] * v2[2];
	var z = v1[0] * v2[1] - v1[1] * v2[0];

	return [x, y, z];
};

// Vector multiplied by a scalar.
IK.vsmult = function(v1, s2) {

	var length = v1.length;
	var v = new Array(length);

	for (var i = 0; i < length; ++i) {
		v[i] = v1[i] * s2;
	}

	return v;
};

// Vector divided by a scalar.
IK.vsdiv = function(v1, s2) {

	var length = v1.length;
	var v = new Array(length);

	for (var i = 0; i < length; ++i) {
		v[i] = v1[i] / s2;
	}

	return v;
};

// Copy a vector.
IK.vcopy = function(v1) {

	var length = v1.length;

	var v = new Array(length);
	for (var i = 0; i < length; ++i) {
		v[i] = v1[i];
	}

	return v;
};

// The square of the magnitude of a vector.
IK.vmag2 = function(v1) {

	return IK.vdot(v1, v1);
};

// The magnitude of a vector.
IK.vmag = function(v1) {

	return Math.sqrt(IK.vmag2(v1));
};

// Normalized vector. The vector itself is not modified.
IK.vnormalize = function(v1) {

	var mag = IK.vmag(v1);
	if (mag == 0)
		return IK.vcopy(v1);
	else
		return IK.vsdiv(v1, mag);
};

/*** Matrix calculations. ***/

// Print a matrix to the console.
IK.mprint = function(m) {

	var rows = m.length;
	for (var i = 0; i < rows; ++i) {
		console.log("[" + m[i] + "]");
	}
};

// Matrix add.
IK.madd = function(m1, m2) {

	var rows = m1.length;
	var cols = m1[0].length;

	var m = new Array(rows);

	for (var i = 0; i < rows; ++i) {
		m[i] = new Array(cols);
		for (var j = 0; j < cols; ++j) {
			m[i][j] = m1[i][j] + m2[i][j];
		}
	}

	return m;
};

// Matrix sub.
IK.msub = function(m1, m2) {

	var rows = m1.length;
	var cols = m1[0].length;

	var m = new Array(rows);

	for (var i = 0; i < rows; ++i) {
		m[i] = new Array(cols);
		for (var j = 0; j < cols; ++j) {
			m[i][j] = m1[i][j] - m2[i][j];
		}
	}

	return m;
};

// Matrix multiplication.
IK.mmult = function(m1, m2) {

	var rows1 = m1.length;
	var cols1 = m1[0].length;
	var cols2 = m2[0].length;

	var m = new Array(rows1);

	for (var i = 0; i < rows1; ++i) {
		m[i] = new Array(cols2);
		for (var j = 0; j < cols2; ++j) {
			m[i][j] = 0;
			for (var k = 0; k < cols1; ++k) {
				m[i][j] += m1[i][k] * m2[k][j];
			}
		}
	}

	return m;
};

// Matrix multiplied by a scalar.
IK.msmult = function(m1, s1) {

	var rows = m1.length;
	var cols = m1[0].length;

	var m = new Array(rows);

	for (var i = 0; i < rows; ++i) {
		m[i] = new Array(cols);
		for (var j = 0; j < cols; ++j) {
			m[i][j] = m1[i][j] * s1;
		}
	}

	return m;
};

// Matrix divided by a scalar.
IK.msdiv = function(m1, s1) {

	var rows = m1.length;
	var cols = m1[0].length;

	var m = new Array(rows);

	for (var i = 0; i < rows; ++i) {
		m[i] = new Array(cols);
		for (var j = 0; j < cols; ++j) {
			m[i][j] = m1[i][j] / s1;
		}
	}

	return m;
};

// Transposed matrix. The matrix itself is not modified.
IK.mtranspose = function(m1) {

	var rows = m1.length;
	var cols = m1[0].length;

	var m = new Array(cols);
	for (var i = 0; i < cols; ++i) {
		m[i] = new Array(rows);
		for (var j = 0; j < rows; ++j) {
			m[i][j] = m1[j][i];
		}
	}

	return m;
};

// Copy a matrix.
IK.mcopy = function(m1) {

	var rows = m1.length;
	var cols = m1[0].length;

	var m = new Array(rows);
	for (var i = 0; i < rows; ++i) {
		m[i] = new Array(cols);
		for (var j = 0; j < cols; ++j) {
			m[i][j] = m1[i][j];
		}
	}

	return m;
};

// Switch two rows within a matrix.
IK.mswitchRows = function(m1, r1, r2) {

	var m = IK.mcopy(m1);

	var rt = m[r1];
	m[r1] = m[r2];
	m[r2] = rt;

	return m;
};

// Switch two columns within a matrix.
IK.mswitchCols = function(m1, c1, c2) {

	var m = IK.mtranspose(m1);
	m = IK.mswitchRows(m, c1, c2);
	m = IK.mtranspose(m);
	return m;
};

// Get a region between two rows and two columns of a matrix.
IK.mregion = function(m1, r1, c1, r2, c2) {

	var rstart = r1 <= r2 ? r1 : r2;
	var cstart = c1 <= c2 ? c1 : c2;
	var rend = r1 >= r2 ? r1 : r2;
	var cend = c1 >= c2 ? c1 : c2;

	var rows = rend - rstart;
	var cols = cend - cstart;

	var m = new Array(rows);

	for (var i = 0; i < rows; ++i) {
		m[i] = new Array(cols);
		for (var j = 0; j < cols; ++j) {
			m[i][j] = m1[i + rstart][j + cstart];
		}
	}

	return m;
};

// Concatenate a matrix to the right of another.
// 'm2' will be concatenated to the right of 'm1'.
IK.mmergeRows = function(m1, m2) {

	var rows = m1.length;
	var cols1 = m1[0].length;
	var cols2 = m2[0].length;

	var m = new Array(rows);
	for (var i = 0; i < rows; ++i) {
		m[i] = new Array(cols1 + cols2);
		for (var j = 0; j < cols1; ++j) {
			m[i][j] = m1[i][j];
		}
		for (var j = 0; j < cols2; ++j) {
			m[i][j + cols1] = m2[i][j];
		}
	}

	return m;
};

// Get an identity matrix of a specified size.
IK.midentity = function(n) {

	var m = new Array(n);

	for (var i = 0; i < n; ++i) {
		m[i] = new Array(n);
		for (var j = 0; j < n; ++j) {
			if (i == j)
				m[i][j] = 1;
			else
				m[i][j] = 0;
		}
	}

	return m;
};

// Move the row with the largest element in the given column
// to the first row of the matrix.
IK.mpivot = function(m1, c1) {

	var rows = m1.length;
	var cols = m1[0].length;

	var emax = Math.abs(m1[c1][c1]);
	var emaxr = c1;

	for (var i = c1 + 1; i < rows; ++i) {
		if (Math.abs(m1[i][c1]) > emax) {
			emaxr = i;
			emax = Math.abs(m1[i][c1]);
		}
	}

	var m = IK.mcopy(m1);

	var rt = m.splice(emaxr, 1)[0];
	m.splice(c1, 0, rt);

	return m;
};

// Solve linear equations.
// 'm1' is expected to be a square matrix, and 'm2' a column matrix.
// 'null' will be returned if there is no solution.
IK.msolve = function(m1, m2) {

	var rows = m1.length;
	var cols = m1[0].length;

	if (m2.length == 1)
		m2 = IK.mtranspose(m2);

	var m = IK.mmergeRows(m1, m2);

	for (var i = 0; i < rows - 1; ++i) {

		m = IK.mpivot(m, i);

		var e0 = m[i][i];

		// No single solution.
		if (e0 == 0) {
			return null;
		}

		// Eliminate the ith element in every row
		// starting from (i + 1)th row. Also affects
		// all elements after the ith element.
		for (var j = i + 1; j < rows; ++j) {

			var e1 = m[j][i];
			var multiplier = e1 / e0;
			m[j][i] = 0;

			for (var k = i + 1; k < cols + 1; ++k) {
				m[j][k] -= m[i][k] * multiplier;
			}
		}
	}

	// Substitute.
	for (var i = rows - 1; i >= 0; --i) {

		m[i][cols] /= m[i][i];
		m[i][i] = 1;

		for (var j = 0; j < i; ++j) {
			m[j][cols] -= m[j][i] * m[i][cols];
			m[j][i] = 0;
		}
	}

	return IK.mtranspose(IK.mregion(m, 0, cols, rows, cols + 1));
};

// Compute the inverse of a matrix. The matrix itself is not modified.
// 'null' will be returned if the matrix is singular.
IK.minvert = function(m1) {

	var rows = m1.length;
	var cols = m1[0].length;

	// Only square matrices have inverse matrices.
	if (rows != cols)
		return null;

	var m = IK.mmergeRows(m1, IK.midentity(rows));

	for (var i = 0; i < rows - 1; ++i) {

		m = IK.mpivot(m, i);

		var e0 = m[i][i];

		// No single solution.
		if (e0 == 0) {
			return null;
		}

		// Eliminate the ith element in every row
		// starting from (i + 1)th row. Also affects
		// all elements after the ith element.
		for (var j = i + 1; j < rows; ++j) {

			var e1 = m[j][i];
			var multiplier = e1 / e0;
			m[j][i] = 0;

			for (var k = i + 1; k < m[0].length; ++k) {
				m[j][k] -= m[i][k] * multiplier;
			}
		}
	}

	// Substitute.
	for (var i = rows - 1; i >= 0; --i) {

		for (var k = cols; k < m[0].length; ++k) {
			m[i][k] /= m[i][i];
		}
		m[i][i] = 1;

		for (var j = 0; j < i; ++j) {
			for (var k = cols; k < m[0].length; ++k) {
				m[j][k] -= m[j][i] * m[i][k];
			}
			m[j][i] = 0;
		}
	}

	return IK.mregion(m, 0, cols, rows, rows + cols);
};

// Homogeneous 2D transformation matrices.

// Get a translation matrix.
IK.m2translate = function(tx, ty) {

	return [[1, 0, tx], [0, 1, ty], [0, 0, 1]];
};

// Get a scaling matrix.
IK.m2scale = function(sx, sy) {

	return [[sx, 0, 0], [0, sy, 0], [0, 0, 1]];
};

// Get a rotation matrix.
IK.m2rotate = function(theta) {

	return [[Math.cos(theta), -Math.sin(theta), 0], [Math.sin(theta), Math.cos(theta), 0], [0, 0, 1]];
};

// Compute the 1-norm of a matrix.
IK.m1norm = function(m1) {

	var norm = 0;

	for (var i = 0; i < m1.length; ++i) {
		for (var j = 0; j < m1[0].length; ++j) {
			var eabs = Math.abs(m1[i][j]);
			norm += eabs;
		}
	}

	return norm;
};

// Compute the 2-norm of a matrix.
IK.m2norm = function(m1) {

	var norm = 0;

	for (var i = 0; i < m1.length; ++i) {
		for (var j = 0; j < m1[0].length; ++j) {
			var eabs = Math.abs(m1[i][j]);
			norm += eabs * eabs;
		}
	}

	return Math.sqrt(norm);
};

// Compute the p-norm of a matrix.
IK.mpnorm = function(m1, p) {

	if (p == 1)
		return IK.m1norm(m1);
	if (p == 2)
		return IK.m2norm(m1);

	var norm = 0;

	for (var i = 0; i < m1.length; ++i) {
		for (var j = 0; j < m1[0].length; ++j) {
			var eabs = Math.abs(m1[i][j]);
			norm += Math.pow(eabs, p);
		}
	}

	return Math.pow(norm, 1 / p);
};

// Convert a n-D vector into a homogeneous row matrix,
// which has (n + 1) elements.
IK.v2homoRow = function(v1) {

	var m = new Array(1);
	m[0] = new Array(v1.length + 1);
	for (var i = 0; i < v1.length; ++i) {
		m[0][i] = v1[i];
	}
	m[0][v1.length] = 1;

	return m;
};

// Convert a n-D vector into a row matrix.
IK.v2row = function(v1) {

	var m = new Array(1);
	m[0] = new Array(v1.length);
	for (var i = 0; i < v1.length; ++i) {
		m[0][i] = v1[i];
	}

	return m;
};

// Convert a n-D vector into a homogeneous column matrix,
// which has (n + 1) elements.
IK.v2homoColumn = function(v1) {
	
	return IK.mtranspose(IK.v2homoRow(v1));
};

// Convert a n-D vector into a column matrix.
IK.v2Column = function(v1) {
	
	return IK.mtranspose(IK.v2Row(v1));
};
