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
    public class QuestionnaireController : ApiController
    {
        private AppEntities db = new AppEntities();

        // GET api/Questionnaire
        public IQueryable<Questionnaire> GetQuestionnaire()
        {
            return db.Questionnaire;
        }

        // GET api/Questionnaire/5
        [ResponseType(typeof(Questionnaire))]
        public IHttpActionResult GetQuestionnaire(int id)
        {
            Questionnaire questionnaire = db.Questionnaire.Find(id);
            if (questionnaire == null)
            {
                return NotFound();
            }

            return Ok(questionnaire);
        }

        // PUT api/Questionnaire/5
        public IHttpActionResult PutQuestionnaire(int id, Questionnaire questionnaire)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != questionnaire.qsnId)
            {
                return BadRequest();
            }

            db.Entry(questionnaire).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionnaireExists(id))
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

        // POST api/Questionnaire
        [ResponseType(typeof(Questionnaire))]
        public IHttpActionResult PostQuestionnaire(Questionnaire questionnaire)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Questionnaire.Add(questionnaire);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = questionnaire.qsnId }, questionnaire);
        }

        // DELETE api/Questionnaire/5
        [ResponseType(typeof(Questionnaire))]
        public IHttpActionResult DeleteQuestionnaire(int id)
        {
            Questionnaire questionnaire = db.Questionnaire.Find(id);
            if (questionnaire == null)
            {
                return NotFound();
            }

            db.Questionnaire.Remove(questionnaire);
            db.SaveChanges();

            return Ok(questionnaire);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QuestionnaireExists(int id)
        {
            return db.Questionnaire.Count(e => e.qsnId == id) > 0;
        }
    }
}