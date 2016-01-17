USE [Test]
GO
/****** Object:  StoredProcedure [dbo].[Test_GetList]    Script Date: 2016/1/15 8:26:46 ******/


GO
USE [Test]
GO
/****** Object:  StoredProcedure [dbo].[QuestionResultList]    Script Date: 2016/1/15 8:26:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[QuestionResultList] ( @qusId INT, @deptId INT )
AS
    SELECT  userId ,
            deptId ,
            userCode ,
            userName ,
            no1 ,
            no2 ,
            no3 ,
            no1 + no2 + no3 AS total
    FROM    ( SELECT    userId ,
                        deptId ,
                        userCode ,
                        userName ,
                        ISNULL(( SELECT COUNT(*)
                                 FROM   dbo.Questionnaire
                                 WHERE  deptId = u.deptId
                                        AND no1 = u.usercode
                                        AND qusId = @qusId
                               ), 0) * 3 AS no1 ,
                        ISNULL(( SELECT COUNT(*)
                                 FROM   dbo.Questionnaire
                                 WHERE  deptId = u.deptId
                                        AND no2 = u.usercode
                                        AND qusId = @qusId
                               ), 0) * 2 AS no2 ,
                        ISNULL(( SELECT COUNT(*)
                                 FROM   dbo.Questionnaire
                                 WHERE  deptId = u.deptId
                                        AND no3 = u.usercode
                                        AND qusId = @qusId
                               ), 0) AS no3
              FROM      dbo.[User] AS u
              WHERE     u.deptId = @deptId
            ) T
    ORDER BY T.deptId ,
            ( no1 + no2 + no3 ) DESC

GO

USE [Test]
GO
/****** Object:  StoredProcedure [dbo].[QuestionnaireResultList]    Script Date: 2016/1/15 8:25:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[QuestionnaireResultList] 

AS 

SELECT   userId ,
        deptId ,
        userCode ,
        userName ,
        no1 ,
        no2 ,
        no3,
		no1 + no2 + no3 AS total
FROM    ( SELECT    userId ,
                    deptId ,
                    userCode ,
                    userName ,
                    ISNULL(( SELECT COUNT(*)
                             FROM   dbo.Questionnaire
                             WHERE  deptId = u.deptId
                                    AND no1 = u.usercode
                           ), 0) * 3 AS no1 ,
                    ISNULL(( SELECT COUNT(*)
                             FROM   dbo.Questionnaire
                             WHERE  deptId = u.deptId
                                    AND no2 = u.usercode
                           ), 0) * 2 AS no2 ,
                    ISNULL(( SELECT COUNT(*)
                             FROM   dbo.Questionnaire
                             WHERE  deptId = u.deptId
                                    AND no3 = u.usercode
                           ), 0) AS no3
          FROM      dbo.[User] AS u
        ) T
		ORDER BY  T.deptId , (no1 + no2 + no3) DESC
