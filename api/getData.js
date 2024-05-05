function getData(conn, req, res) {
  const { id, col } = req.query;

  let query;

  switch (col) {
    case "company":
      query = !id
        ? `SELECT company.*, 
        total_interns, 
        coop_interns,
        total_interns - coop_interns AS interns
        FROM ( SELECT co.co_id, COUNT(it.std_id) AS total_interns,
            SUM(CASE WHEN it.intern_type = 'สหกิจ' THEN 1 ELSE 0 END) AS coop_interns
            FROM senior_intern it
            JOIN company co ON it.co_id = co.co_id
            LEFT JOIN users u ON it.std_id = u.username
            GROUP BY co.co_id
        ) AS intern_counts
        JOIN company ON intern_counts.co_id = company.co_id
        ORDER BY total_interns DESC;`

        : `SELECT company.*, 
        total_interns, 
        coop_interns,
        total_interns - coop_interns AS interns
        FROM ( SELECT co.co_id, COUNT(it.std_id) AS total_interns,
            SUM(CASE WHEN it.intern_type = 'สหกิจ' THEN 1 ELSE 0 END) AS coop_interns
            FROM senior_intern it
            JOIN company co ON it.co_id = co.co_id
            LEFT JOIN users u ON it.std_id = u.username
            WHERE it.co_id = ${id}
            GROUP BY co.co_id
        ) AS intern_counts
        JOIN company ON intern_counts.co_id = company.co_id
        ORDER BY total_interns DESC;`;
      conn.query(query, (err, result) => {
        if (err) {
          return res.json(err);
        } else {
          res.json(result);
        }
      });
      break;

    case "wishlist":
      query = `SELECT co.co_name, COUNT(wl.std_id) AS count
      FROM wishlist wl
      JOIN company co ON wl.co_id = co.co_id
      GROUP BY  wl.co_id
      ORDER BY COUNT(wl.std_id) DESC
      LIMIT 10
      `;
      conn.query(query, (err, result) => {
        if (err) {
          return res.json(err);
        } else {
          res.json(result);
        }
      });
      break;

    case "workDetail":
      query = !id ? `
      SELECT work_detail, COUNT(work_detail) AS work_count
      FROM senior_intern
      GROUP BY work_detail
      ORDER BY work_count
      `
      : `
      SELECT work_detail, COUNT(work_detail) AS work_count
      FROM senior_intern
      WHERE years = ${id}
      GROUP BY work_detail
      ORDER BY work_count
      `;
      // let data=[
      //   { work_detail: 'Work 1', work_count: 10 },
      //   { work_detail: 'Work 3', work_count: 30 },
      //   { work_detail: 'Work 2', work_count: 50 },
      //   { work_detail: 'Work 4', work_count: 60 },
      //   { work_detail: 'Work 5', work_count: 30 },
      //   { work_detail: 'Work 6', work_count: 10 },
      // ]
      conn.query(query, (err, result) => {
        if (err) {
          return res.json(err);
        } else {
          res.json(result);
        }
      });
      break;

    default:
      res.send("what are you looking for?");
      break;
  }
}

module.exports = { getData };
