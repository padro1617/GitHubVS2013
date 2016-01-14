using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using FWH.DataSource;

namespace FWH.Controllers
{
    public class DepartmentController : ApiController
    {
        private AppEntities db =null;
        //private AppEntities db = new AppEntities();

        // GET api/Department
        public IQueryable<Department> GetDepartment_bb()
        {
            if (db == null)
            {
                return null;
            }
            return db.Department;
        }
        [ResponseType(typeof(Department))]
        public IHttpActionResult GetDepartment(int id)
        {
            var list = new List<Department>();
            list.Add(new Department { deptId = 1, deptName = "技术部" });
            list.Add(new Department { deptId = 2, deptName = "销售部门" });
            return Ok(list);
        }

        //// GET api/Department/5
        ////[ResponseType(typeof(Department))]
        //public IHttpActionResult GetDepartment_aa(int id)
        //{
        //    if (db == null)
        //    {
        //        return null;
        //    }
        //    Department department = db.Department.Find(id);
        //    if (department == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(department);
        //}

        // PUT api/Department/5
        public IHttpActionResult PutDepartment(int id, Department department)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != department.deptId)
            {
                return BadRequest();
            }

            db.Entry(department).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Department
        [ResponseType(typeof(Department))]
        public IHttpActionResult PostDepartment(Department department)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Department.Add(department);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = department.deptId }, department);
        }

        // DELETE api/Department/5
        [ResponseType(typeof(Department))]
        public IHttpActionResult DeleteDepartment(int id)
        {
            Department department = db.Department.Find(id);
            if (department == null)
            {
                return NotFound();
            }

            db.Department.Remove(department);
            db.SaveChanges();

            return Ok(department);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DepartmentExists(int id)
        {
            return db.Department.Count(e => e.deptId == id) > 0;
        }
    }
}