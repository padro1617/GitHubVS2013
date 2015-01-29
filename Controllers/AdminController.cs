using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using FWH.DataSource;

namespace FWH.Controllers
{
	public class AdminController : Controller
	{
		//
		// GET: /Admin/
		public ActionResult Index( ) {
			return View();
		}

		public JsonResult Report( ) {
			using ( var db = new AppEntities() ) {
				return Json( db.QuestionnaireResultList().ToList() );
			}
		}

		public JsonResult QSReport( int qusId, int deptId ) {
			using ( var db = new AppEntities() ) {
				return Json( db.QuestionResultList( qusId, deptId ).ToList() );
			}
		}
	}
}