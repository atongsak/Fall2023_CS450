// make this 120 for the mac:
//#version 120 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uS0, uT0, uD;

// ellipse center
uniform float uSc, uTc;

// ellipse radii
uniform float uRs, uRt;

// in variables from the vertex shader and interpolated in the rasterizer:

varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates

void
main( )
{
	float s = vST.s;
	float t = vST.t;

	// determine the color using the square-boundary equations:
	vec3 myColor = uColor;

	float a = uRs * 0.1; // semi-major axis
	float b = uRt * 0.3; // semi-minor axis

	//float a = uD / 2.0; // Semi-major axis
   	//float b = a * 0.75;   // Semi-minor axis

	float x = (s - uSc)/a;
	float y = (t - uTc)/b;

	

    // Ellipse boundary check
   // if ((s - uS0) * (s - uS0) / (a * a) + (t - uT0) * (t - uT0) / (b * b) <= 1.0)
	if ((s - uSc) * (s - uSc) / (a * a) + (t - uTc) * (t - uTc) / (b * b) <= 1.0)

	//if ( x*x + y*y <= 1.0 )
	{
		myColor = vec3( 1., 1., 0. );
	}

	// apply the per-fragment lighting to myColor:

	vec3 Normal = normalize(vN);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);

	vec3 ambient = uKa * myColor;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * myColor;

	float ss = 0.;
	if( dot(Normal,Light) > 0. )	      // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		ss = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * ss * uSpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}

