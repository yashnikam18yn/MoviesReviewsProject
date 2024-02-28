




var userid;
var movieid;
var username;


//--------Enable Tab -------------

function enable(){
    document.getElementById("feed-tab").removeAttribute('disabled');
    document.getElementById("profile-tab").removeAttribute('disabled');
    document.getElementById("my-movies-tab").removeAttribute('disabled');
    
    const feedTab = new bootstrap.Tab(document.getElementById("feed-tab"));
    feedTab.show();
}

// Fetch all movies

function allMovies() {
    fetch("http://localhost:8080/postbook/webapi/project/movies/allmovies", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        mapMovies(data);
        console.log(data);
    });
}

// Map movies to HTML
function mapMovies(movies) {
    let listString = '<div class="container"><div class="row">';
    for (let i = 0; i < movies.length; i++) {
		
        listString += `
        <div class="col-md-4 mb-4">
            <div class="card h-100" style="width: 18rem;">
                <img src="${movies[i].imageUrl}" class="card-img-top" style="height: 300px; object-fit: cover;" alt="Movie Poster">
                <div class="card-body">
                    <h5 class="card-title">${movies[i].movieTitle}</h5>
                    <p class="card-text" style="font-size: 14px;">${movies[i].movieDescription}</p>
                    <p class="card-text" style="font-size: 14px;"><strong>Director:</strong> ${movies[i].movieDirector}</p>
                    <p class="card-text" style="font-size: 14px;"><strong>Genre:</strong> ${movies[i].movieGenere}</p>
                   <button type="button" class="btn btn-primary" onclick="modalClickHandle(${movies[i].moviesId})" style="font-size: 14px;" >Add Review</button>
                </div>
            </div>
        </div>`;
    }
    listString += '</div></div>';
    document.getElementById('movieList').innerHTML = listString;
}

// Submit Review function
function submitReview() {
    // Your code to handle review submission
    // This function should handle the logic when the "Add" button in the modal is clicked
}

// --------------- User Sign Up ------------------



function signUp(){
	console.log("function work");
	
    const users = {
        userName:document.getElementById("username").value,
        userEmail:document.getElementById("useremail").value,
        userPassword:document.getElementById("userpassword").value,
    };
    
    document.getElementById("username").value = "";
    document.getElementById("useremail").value = "";
    document.getElementById("userpassword").value = "";
    

    fetch("http://localhost:8080/postbook/webapi/project/movieusers/add",{
        method: 'POST',

        headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(users)


    }).then((res)=>{
        res.json()
    }).then((data)=>{
        console.log(data);
        alert("signup sucess");
        enable();
    })
	   
}   


//-----------------User Sign In--------------------
function signIn(){
	const userLogin = {
        userEmail:document.getElementById("useremaillogin").value,
        userPassword:document.getElementById("userpasswordlogin").value,
    };
    
    document.getElementById("useremaillogin").value = "";
    document.getElementById("userpasswordlogin").value = "";


    fetch("http://localhost:8080/postbook/webapi/project/movieusers/login",{
        method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userLogin)
    }).then((res)=>res.json())
      .then((data)=>{
        console.log(data);
        userid = data.userId;
        username=data.userName;
        console.log(userid);
        alert("Login Sucess...");
        enable();
      }).catch((err)=>{
            console.log("Error:"+err);
      });

}




//---------------Modal --------------------
function modalClickHandle(moviesid){
	movieid=moviesid;
    console.log("inside Function ")
    jQuery.noConflict();
    jQuery('#addReviewModal').modal('show')
}


function btnClose()
{
    jQuery('#addReviewModal').modal('close')
}

//--------------- Add New Reviews -----------------


function addNewReview(){
	
	
	const reviewData = {
		reviewText:document.getElementById('reviewText').value,
		
		movies:{
			moviesId:movieid,
		},
		movieusers:{
			userId:userid,
			userName:username
			
		}
		
	}
	
	console.log(reviewData);
	
	fetch("http://localhost:8080/postbook/webapi/project/reviews/add",{
		method:'POST',
		
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reviewData)
	}).then((res)=>{
		res.json();
	}).then(data=>{
		
		console.log(data);
		alert("Review Added");
	});
	
}



//------------All Reviews---------------


function viewAllReview(){
    fetch("http://localhost:8080/postbook/webapi/project/reviews/getallreviews", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
		mapReviews(data);
		console.log(data);
        console.log(data.reviewId)
		})
    .catch(error => console.error('Error fetching reviews:', error));
}


function mapReviews(reviews){
	var listString = "";
	reviews.reviewId;
	for(let i=0;i<reviews.length;i++){
		listString += `<div class="container mt-5">
					<div class="card">
						
						<div class="card-body">
							<h5 class="card-title">${reviews[i].movies.movieTitle}</h5>
							<p class="card-text">${reviews[i].reviewText}</p>
							<p class="card-text">
								<small class="text-muted">Review by: ${reviews[i].username}</small>
							</p>
							<!-- Heart-shaped like button -->
							<button type="button" class="btn btn-link like-button">
								<i style="color: red;" class="bi bi-heart like-heart"></i>
								
                    			
							</button>
							<i class="bi bi-chat"></i>
						</div>
					</div>
				</div>`
	}
	
	document.getElementById("reviewList").innerHTML=listString;
}

function viewMyReviews(){
	console.log("My Reviews");
	fetch(`http://localhost:8080/postbook/webapi/project/reviews/getmyreviews/${userid}`,{
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(resp=>resp.json())
	  .then(data=>{
		  myReviewMap(data);
		  console.log(data);
          console.log(data.reviewId)
		  })
	  .catch(err=>console.log(err))
}

function myReviewMap(review){
	var listString = "";
	
	for(let i=0;i<review.length;i++){
		listString += `
				<div class="container mt-5">
					<div class="card">
						
						<div class="card-body">
							<h5 class="card-title">${review[i].movies.movieTitle}</h5>
							<p class="card-text">${review[i].reviewText}</p>
							<p class="card-text">
								<small class="text-muted">Review by: ${review[i].username}</small>
							</p>
							<!-- Heart-shaped like button -->
							<button onClick="deleteReview(${review[i].reviewId})"  type="button" class="btn btn-link like-button">
								<i class="bi bi-trash"></i>
								
                    			
							</button>
							<i class="bi bi-chat"></i>
						</div>
					</div>
				</div>
		
		`
	}
	
	document.getElementById("myreviewList").innerHTML=listString;
}

function deleteReview(reviewid){
	console.log(reviewid);
	fetch(`http://localhost:8080/postbook/webapi/project/reviews/deletemyreviews/${reviewid}`,{
		method:'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((resp)=>{
		//console.log(resp)
		//myReviewMap();
		viewMyReviews();
		resp.json()
	}).then((data)=>{
		console.log(data)
		})
}
