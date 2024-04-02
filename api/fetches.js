function fetchprv(conn, req, res) {
  const query = `SELECT co_prv, COUNT(*) AS co_prv_count
    FROM company
    WHERE NOT co_prv = ''
    GROUP BY co_prv
    ORDER BY co_prv`;
  try {
    conn.query(query, (err, result) => {
      if (err) {
        res.json({ status: "error", msg: err });
        return;
      }
      res.json({ status: "founded", data: result });
    });
  } catch {
    res.json({ status: "error", msg: "Something went wrong!" });
  }
}

function fetchType(conn, req, res) {
  const query = `
    SELECT intern_type, COUNT(*) AS intern_type_count
    FROM senior_intern
    WHERE NOT intern_type = ''
    GROUP BY intern_type
    `;
  try {
    conn.query(query, (err, result) => {
      if (err) {
        res.json({ status: "error", msg: err });
        return;
      }
      res.json({ status: "founded", data: result });
    });
  } catch {
    res.json({ status: "error", msg: "Something went wrong!" });
  }
}

function fetchSearchResult(conn, req, res) {
  const { querytxt, prv, view, intern, coop, priv, grov } = req.body;

  let query = `
  SELECT DISTINCT co.* FROM company co
`;

  if (view) {
    query += `
    JOIN senior_intern istd ON co.co_id = istd.co_id`;
  }

  if (querytxt || prv || view || intern || coop || priv || grov) {
    query += " WHERE ";

    if (priv && !grov) {
      query += `(co.co_type = 'บริษัทเอกชน') AND (co.co_type <> '')`;
    } else if (!priv && grov) {
      query += `(co.co_type = 'ราชการ') AND (co.co_type <> '')`;
    } else {
      query += `(co.co_type <> '')`
    }

    if (view || intern || coop) {
      if (query.includes(")")) {
        query += " AND "
      }
      if (view) {
        query += `(istd.intern_type <> '')`
        if (intern && coop) {
          query += `AND (istd.intern_type IN ('ฝึกงาน', 'สหกิจ'))`
        } else if (intern) {
          query += `AND (istd.intern_type = 'ฝึกงาน')`
        } else if (coop) {
          query += `AND (istd.intern_type = 'สหกิจ')`
        }
      }
    }

    if (querytxt) {
      if (query.includes(")")) {
        query += " AND "
      }
      if (isNaN(querytxt)) {
        query += `(co.co_name LIKE '%${querytxt}%')`;
      } else {
        query += "(co.co_id = " + querytxt + ")";
      }
    }

    if (prv) {
      if (query.includes(")")) {
        query += " AND "
      }
      query += `(co.co_prv = '${prv}')`
    }
  }

  query += " ORDER BY co.co_name;";

  try {
    conn.query(query, (err, result) => {
      // console.log(err)
      if (err) {
        res.json({ status: "error", msg: err });
      } else if (result.length > 0) {
        res.json({
          status: "founded",
          len: result.length,
          data: result,
        });
      } else {
        res.json({ status: "no match" });
      }
    });
  } catch (error) {
    res.json({ status: "error", msg: "Something went wrong!" });
  }
}

function fetchCoDetails(conn, req, res) {
  const { co_id } = req.body;

  try {
    const query = `
    SELECT DISTINCT co.co_id, co.co_name,
    istd.std_id, u.fname, u.lname,
    istd.intern_type, c.comment 
    FROM company co
    JOIN senior_intern istd ON co.co_id = istd.co_id
    LEFT JOIN users u ON istd.std_id = u.username
    LEFT JOIN comments c ON istd.std_id = c.std_id
    WHERE co.co_id = ? AND istd.intern_type IS NOT NULL AND istd.intern_type <> '' 
    AND istd.std_id IS NOT NULL AND istd.std_id <> ''
    ORDER BY istd.std_id;
    `;
    conn.query(query, [co_id], (err, result) => {
      if (err) {
        return res.status(500).json({ status: "error", msg: err });
      }

      if (result.length > 0) {
        const contactQuery = `
        SELECT DISTINCT *
        FROM co_contact
        WHERE co_id = ? 
              AND NOT contact_name = '' 
              AND ((NOT contact_tel = '') OR (NOT email = ''))
        ORDER BY department;
        `;
        conn.query(contactQuery, [co_id], (err, contact) => {
          if (err) {
            return res.status(500).json({ status: "error", msg: err });
          }
          return res.json({
            status: "founded",
            count: result.length,
            data: result,
            contact: contact,
          });
        });
      } else {
        return res.json({ status: "no match" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", msg: "Something went wrong!" });
  }
}

function fetchMinor(conn, req, res) {
  let query = `SELECT DISTINCT minor FROM users 
  WHERE minor IS NOT NULL AND minor <> '' ORDER BY minor;`;
  conn.query(query, (err, result) => {
    if (err) {
      return res.json({ status: "error", msg: err.message });
    } else if (result.length > 0) {
      return res.json({ state: "success", data: result });
    } else {
      return res.json({ status: "notfound" });
    }
  });
}

module.exports = {
  fetchprv,
  fetchType,
  fetchSearchResult,
  fetchCoDetails,
  fetchMinor,
};
