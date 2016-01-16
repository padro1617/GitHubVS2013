using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FWH.Controllers
{
    public class ActiveController : Controller
    {
        #region 七福年会
        /// <summary>
        /// 年会人数统计
        /// </summary>
        /// <returns></returns>
        // GET: Active
        public ActionResult Index()
        {
            return View();
        }

        #endregion
    }
}