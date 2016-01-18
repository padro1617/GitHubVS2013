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


GO

/*
	EXEC Test.dbo.UserResultList
*/
ALTER PROCEDURE  UserResultList
AS
BEGIN
	SELECT  
	a.userId ,
	a.deptId ,
	a.userCode ,
	a.userName ,
	ISNULL(a.parentId,0) AS parentId ,
	ISNULL(a.sex,'') AS sex ,
	ISNULL(a.isChild ,'') AS isChild ,
	ISNULL(a.relative,'') AS relative ,
	ISNULL(a.relativePhone,'') AS relativePhone ,
	ISNULL(a.remark,'') AS remark,
	ISNULL(b.deptName,'') AS deptName,
	ISNULL(c.id,0) AS actionId,
	ISNULL(c.isJoin,0) AS isJoin,
	ISNULL(c.groupId,0) AS groupId
	 FROM dbo.[User] AS a 
	 LEFT JOIN dbo.Department AS b ON a.deptId=b.deptId
	 LEFT JOIN dbo.ActiveInfo AS c ON a.userId=c.userId
END
GO


/*
	EXEC Test.dbo.UserResultList
*/
ALTER PROCEDURE Active_Nh_Insert(
	@userId INT,
	@parentId INT,
	@userName NVARCHAR(50),
	@sex NVARCHAR(10),
	@isChild NVARCHAR(10),
	@groupId INT
	)
AS
BEGIN
	IF(@parentId>0)
	BEGIN
		PRINT '添加家属'
		--添加家属
		DECLARE @fuserId INT 
		DECLARE @puserId INT 
		DECLARE @deptId INT 
		SELECT TOP 1 @puserId=userId,@deptId=deptId FROM dbo.[User] WHERE userId=@parentId
		PRINT @puserId
		INSERT dbo.[User]
		        ( deptId ,
		          userCode ,
		          userName ,
		          parentId ,
		          sex ,
		          isChild ,
		          relative ,
		          relativePhone ,
		          remark
		        )
		VALUES  ( @deptId , -- deptId - int
		          N'' , -- userCode - nvarchar(50)
		          @userName , -- userName - nvarchar(50)
		          @parentId , -- parentId - int
		          @sex , -- sex - nvarchar(10)
		          @isChild , -- isChild - bit
		          N'' , -- relative - nvarchar(20)
		          N'' , -- relativePhone - nvarchar(50)
		          N''  -- remark - nvarchar(100)
		        )
		SET @fuserId= SCOPE_IDENTITY()
		PRINT @fuserId
		INSERT dbo.ActiveInfo
		        ( userId, isJoin, groupId )
		VALUES  ( @fuserId, -- userId - int
		          1, -- isJoin - bit
		          @groupId  -- groupId - int
				  )
		
	END
	ELSE
	BEGIN
		IF(EXISTS(SELECT TOP 1 1 FROM dbo.ActiveInfo WHERE userId=@userId))
		BEGIN
			--存在记录
			UPDATE dbo.ActiveInfo SET groupId=@groupId WHERE userId=@userId
		END
		ELSE
		BEGIN
			INSERT dbo.ActiveInfo
		        ( userId, isJoin, groupId )
			VALUES  (  @userId, -- userId - int
		          1, -- isJoin - bit
		          @groupId  -- groupId - int
				  )
		END
	END
END





go
/*
	EXEC Test.dbo.UserResultList
	lpd 
*/
ALTER PROCEDURE Active_Nh_Delete(
	@userId INT,
	@groupId INT,
	@result INT OUTPUT
		)
AS
BEGIN
	IF(@userId>0)
	BEGIN
		DELETE dbo.ActiveInfo WHERE userId=@userId AND groupId=@groupId
		SET @result=@@ROWCOUNT
	END
	ELSE 
	BEGIN
		SET @result=0
	END
	PRINT @result
END