function studentquery(conn, req, res) {
  const { id } = req.body;

  const detectID = () => {
    if (isNaN(id)) {
      return `(u.fname LIKE ? OR u.lname LIKE ?)`;
    } else if (id.length !== 3) {
      return `u.username LIKE CONCAT(?, '%')`;
    } else {
      return `u.username LIKE CONCAT('%', ?)`; // Modified for finding id in right
    }
  };

  let query = `
      SELECT DISTINCT u.username, u.fname, u.lname, u.email,
      u.minor, u.tel, u.role, s.intern_type 
      FROM users u
      LEFT JOIN senior_intern s ON u.username = s.std_id
      WHERE u.role = 'std'
      AND ${detectID()}
      ORDER BY u.username
      `;

  const parameter = isNaN(id) ? [`%${id}%`, `%${id}%`] : id; // Adjust parameter based on id type

  conn.query(query, parameter, (err, result) => {
    if (err) {
      return res.json({ status: "error", msg: err.message });
    }
    if (result.length > 0) {
      return res.json({ status: "found", data: result });
    } else {
      return res.json({ status: "404" });
    }
  });
}


module.exports = { studentquery };
