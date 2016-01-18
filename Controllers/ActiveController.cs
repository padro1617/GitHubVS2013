using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using FWH.DataSource;
using System.Data.Entity.Core.Objects;
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

        [HttpGet]
        public JsonResult userall()
        {
            using (var db = new AppEntities())
            {
                return Json(db.UserResultList().ToList(),JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

        #region 年会存储过程接口
        /// <summary>
        /// 添加年会参与人员 或 家属
        /// </summary>
        /// <param name="userId">员工ID</param>
        /// <param name="parentId"> 作为判断标准 0 代表员工</param>
        /// <param name="userName">名称 </param>
        /// <param name="sex">男/女</param>
        /// <param name="isChild">大人 小孩</param>
        /// <param name="groupId">座位号</param>
        [HttpPost]
        public int sitadd(int userId, int parentId, string userName, string sex, string isChild, int groupId)
        {
            using (var db = new AppEntities())
            {
                return db.Active_Nh_Insert(userId,parentId,userName,sex,isChild,groupId);
            }
        }

        /// <summary>
        /// 移除座位
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        [HttpPost]
        public int sitdel(int userId, int groupId)
        {
            ObjectParameter result = new ObjectParameter("result", -10);
            using (var db = new AppEntities())
            {
                db.Active_Nh_Delete(userId, groupId, result);
            }
            return int.Parse(result.Value.ToString());
        }
        #endregion
    }
}